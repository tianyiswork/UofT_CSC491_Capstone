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

router.get('/:id', intellitune, function (req, res, next) {
    googleIt({ 'query': res.lyrics }).then(results => {
        // access to results object here
        if (results.length) return res.status(200).json({
            title: results[0].title,
            link: results[0].link
        })

        return res.status(404).json({
            message: 'Music could not be identified.'
        })
    }).catch(e => {
        // any possible errors that might have occurred (like no Internet connection)
        throw e;
    })
});

module.exports = router;