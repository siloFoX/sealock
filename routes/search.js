// router/search.js

var express = require('express');
var router = express.Router();

// GET : search
router.get('/', function (req, res) {
    res.render('search');
})

module.exports = router;