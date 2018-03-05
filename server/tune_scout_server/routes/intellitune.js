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

/* GET lyrics. */
router.get('/:id', function (req, res, next) {
    let result = '';
    const stream = ytdl(req.params.id, { format: (format) => format.container === 'mp4' })
        .pipe(fs.createWriteStream('video.mp4'));

    stream.on('finish', () => {
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
