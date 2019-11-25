// router/main.js

var express = require('express');
var router = express.Router();

// GET : root 
router.get('/', function (req, res) { 
    res.render('index');
})

module.exports = router;