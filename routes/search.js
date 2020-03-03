// router/search.js

var express = require('express');
var router = express.Router();

// GET : search
router.get('/', function (req, res) {
    console.log("Search mode on")
    res.render('search');
})

router.post('/', function (req, res) {
    console.log("Hello search!")
    res.json({"result" : "ok"})
})

module.exports = router;