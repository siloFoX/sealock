// router/print.js

var express = require('express');
var router = express.Router();

// GET : print
router.get('/', function (req, res) {
    console.log("Print mode on")
    res.render('print');
})

module.exports = router;