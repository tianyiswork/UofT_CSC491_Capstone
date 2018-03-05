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

const SECONDS = 1 / 1000;
const MB = 1 / 1024 / 1024;

/* GET lyrics. */
router.get('/:id', function (req, res, next) {
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
            .output('video.wav')
            .run();
        recognizer
            .start()
            .then(_ => {
                recognizer.on('recognition', (e) => {
                    if (e.RecognitionStatus === 'Success') {
                        result += (e.DisplayText + ' ');
                    } else if (e.RecognitionStatus == 'EndOfDictation') {
                        fs.unlink('video.wav', (err) => {
                            if (err) throw err;
                            console.log('video.wav was deleted');
                        });
                        fs.unlink('video.mp4', (err) => {
                            if (err) throw err;
                            console.log('video.wav was deleted');
                        });
                        res.status(200).json({
                            lyrics: result
                        })
                    } else {
                        console.log(e);
                    }
                });

                recognizer.sendFile('video.wav')
                    .then(_ => console.log('file sent.'))
                    .catch(console.error);
            }).catch(console.error);
    });

});

module.exports = router;
