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
        console.log('Download completed!');
        ffmpeg('video.mp4')
            .output('pre-vocal-extraction/video.wav')
            .run();

        // Exctract vocals
        const getVocals = childProcess.spawn('./get_vocals.sh');

        getVocals.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        getVocals.on('close', (code) => {
            console.log('Sending to Speech Recognizer');
            if (!fs.existsSync(ML_OPTIONS.args[1] + '/video-voice.wav')) {
                console.log('ERROR: File was not created properly');
                res.status(500).end();
                throw InternalError;
            }
            recognizer
                .start()
                .then(_ => {
                    recognizer.on('recognition', (e) => {
                        if (e.RecognitionStatus === 'Success') {
                            result += (e.DisplayText + ' ');
                        } else if (e.RecognitionStatus == 'EndOfDictation' && !returned) {
                            returned = true;
                            fs.unlink('./pre-vocal-extraction/video.wav', (err) => {
                                if (err) throw err;
                                console.log('video.wav was deleted');
                            });
                            return fs.unlink('video.mp4', (err) => {
                                if (err) throw err;
                                console.log('video.wav was deleted');
                                res.lyrics = result;
                                return next();

                            });
                        } else {
                            console.log(e);
                        }
                    });

                    recognizer.sendFile('./vocals/video-voice.wav')
                        .then(_ => console.log('file sent.'))
                        .catch(console.error);
                }).catch(console.error);
        });
    });
}

/* GET lyrics. */
router.get('/:id', intellitune, (req, res, next) => {
    res.status(200).json({
        lyrics: res.lyrics
    });
});

router.intellitune = intellitune

module.exports = router;
