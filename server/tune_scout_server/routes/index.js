var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).sendFile(path.resolve(__dirname, '..', '..', 'client', 'src', 'client', 'dist', 'index.html'));
});

module.exports = router;
