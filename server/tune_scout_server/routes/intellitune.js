var express = require('express');
var router = express.Router();
var path = require('path');
const fs = require('fs');
const ytdl = require('ytdl-core');
const speechService = require('ms-bing-speech-service');
const options = {
    language: 'en-US',
    subscriptionKey: '931398b4600c4d4bb9925b60b4f349d8'
};
const recognizer = new speechService(options);
const ffmpeg = require('fluent-ffmpeg');
const pyshell = require('python-shell');
const childProcess = require('child_process');

const SECONDS = 1 / 1000;
const MB = 1 / 1024 / 1024;
const ML_OPTIONS = {
    scriptPath: __dirname + '/../../../ML/music-source-separation/',
    args: [__dirname + '/../pre-vocal-extraction', __dirname + '/../vocals']
};
const ML_SCRIPT = 'eval.py';

let intellitune = (req, res, next) => {
    let returned = false;
    console.log('Intellitune hit with id: ' + req.params.id);
    let result = '';
    console.time("downloadVid");
    const stream = ytdl(req.params.id, { format: (format) => format.container === 'mp4' });
    let startTime = null;
    let lastTime = null;
    stream.on('progress', (chunkLength, downloaded, total) => {
        if (!startTime) {
            startTime = Date.now();
            lastTime = startTime;
        }
        let currentTime = Date.now()
        if ((currentTime - lastTime) * SECONDS > 1) {
            lastTime = currentTime;
            let downloadedSeconds = (currentTime - startTime) * SECONDS;
            let floatDownloaded = downloaded / total;
            console.log('\nDownloaded: ' + (floatDownloaded * 100).toFixed(2) + '%');
            console.log('Elapsed Time: ' + downloadedSeconds.toFixed(2) + ' seconds');
            console.log('Estimated time left: ' + (downloadedSeconds / floatDownloaded - downloadedSeconds).toFixed(2) + ' seconds');
        }
    });
    stream.pipe(fs.createWriteStream('video.mp4'));
    stream.on('finish', () => {
        console.timeEnd("downloadVid");
        console.log('Download completed!');
        ffmpeg('video.mp4')
            .output('pre-vocal-extraction/video.wav')
            .run();

        // Exctract vocals
        console.time("extractVocals");
        const getVocals = childProcess.spawn('./get_vocals.sh');

        getVocals.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        getVocals.on('close', (code) => {
            console.timeEnd("extractVocals");

            // Split up vocals
            console.time("splitVocals");
            const splitVocals = childProcess.spawn('./split_vocals.sh');

            splitVocals.stdout.on('data', (data) => {
                console.log(`stdout: ${data}`);
            });

            splitVocals.on('close', (code) => {
                console.timeEnd("splitVocals");
                console.time("speechRecog");
                console.log('Sending to Speech Recognizer');
                const vocalRegex = /vocal\d+.wav/;
                let vocalFiles = fs.readdirSync(ML_OPTIONS.args[1]).filter(file => file.match(vocalRegex));
                if (vocalFiles.length == 0) {
                    // Ensure at least one file exists.
                    console.log('ERROR: File was not created properly');
                    res.status(500).end();
                    throw InternalError;
                }
                vocalFiles = vocalFiles.map((file) => ML_OPTIONS.args[1] + '/' + file);
                Promise.all(vocalFiles.map((file) => recognizeFile(file)))
                .then(values => {
                    res.lyrics = cleanLyrics(values);
                    console.timeEnd("speechRecog");
                    vocalFiles.forEach((file) => {
                        fs.unlink(file, (err) => {
                            if (err) throw err;
                            console.log(file + ' was deleted');
                        });
                    });

                    fs.unlink('./video.mp4', (err) => {
                        if (err) throw err;
                        console.log('video.mp4 was deleted');
                    });

                    fs.unlink('./vocals/video-music.wav', (err) => {
                        if (err) throw err;
                        console.log('video-music.wav was deleted');
                    });

                    fs.unlink('./vocals/video-original.wav', (err) => {
                        if (err) throw err;
                        console.log('video-original.wav was deleted');
                    });

                    fs.unlink('./vocals/video-voice.wav', (err) => {
                        if (err) throw err;
                        console.log('video-voice.wav was deleted');
                    });
                    next();
                });
            });
        });
    });
}

let recognizeFile = (file) => {
    return new Promise((res, rej) => {
        const recognizer = childProcess.spawn('python', ['recognize.py', file]);
        recognizer.stdout.on('data', (data) => {
            let dataStr = data.toString();
            res(dataStr);
        });

        recognizer.on('exit', () => {
            console.log('Done!');
            res();
        });
    });
}

let cleanLyrics = (lyricList) => {
    // Include non-trivial transcriptions
    let cleanedList = lyricList.filter((lyrics) => lyrics);
    console.log(cleanedList);
    cleanedList = cleanedList.filter((lyrics) => {
        console.log(lyrics);
        return lyrics.split(" ").length > 4;
    });

    // Remove \n
    cleanedList = cleanedList.map((lyrics) => lyrics.slice(0, -1));
    return cleanedList.join(' ');
}

/* GET lyrics. */
router.get('/:id', intellitune, (req, res, next) => {
    res.status(200).json({
        lyrics: res.lyrics
    });
});

router.intellitune = intellitune

module.exports = router;
