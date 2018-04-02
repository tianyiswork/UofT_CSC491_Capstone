var express = require('express');
var router = express.Router();
var path = require('path');
const search = require('youtube-search');
const intellitune = require('./intellitune').intellitune;
let opts = {
    maxResults: 10,
    key: 'AIzaSyARwjtpUqpG5Zu_Gp4oJFoxQwx8-vnyCfA',
    // type: 'video',
    // videoCategoryId: 10
};
var googleIt = require('google-it');
var api = require('genius-api');
var genius = new api('N1hMGKf1el6WxYu0VjH2K7PEksji9MQtd8qkMYWyXLcKvD0zRe1Kem22OWdTS-qE');
var stringSimilarity = require('string-similarity');
var exec = require('child-process-promise').exec;

router.get('/:id', intellitune, function (req, res, next) {
    googleIt({ 'query': res.lyrics }).then(results => {
        // access to results object here
        if (results.length) {
            let top_5 = [];
            let promises = [];
            for (let i = 0; i < 5 && i < results.length; i++) {
                promises.push(exec('./get_lyrics.sh \"' + results[i].title + '\"'));
            }
            Promise.all(promises).then(values => {
                for (let i = 0; i < promises.length; i++) {
                    top_5.push({
                        title: results[i].title,
                        link: results[i].link,
                        confidence: ''+(stringSimilarity.compareTwoStrings(res.lyrics, values[i].stdout.split('\n')[1] ? values[i].stdout : '')*100)+'%'
                    });
                }

                return res.status(200).json({
                    top_5
                });
            })
            .catch((err) => console.log(err));
        } else {
            return res.status(404).json({
                message: 'Music could not be identified.'
            });
        }
    }).catch(e => {
        // any possible errors that might have occurred (like no Internet connection)
        throw e;
    })
});

module.exports = router;