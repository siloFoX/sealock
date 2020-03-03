// router/search.js

var express = require('express');
var router = express.Router();

const fs = require('fs-extra');
const path = require('path');
const mongoClient = require('mongodb').MongoClient;

// GET : search
router.get('/', function (req, res) {
    console.log("Search mode on")
    res.render('search');
})

router.post('/', function (req, res) {

    var rawReq = req.body

    // console.log(rawReq["name"])
    // console.log(rawReq["start-date"])
    // console.log(rawReq["end-date"])

    fs.readFile("./collection_allocate.json", (err, file) => {
        
        if(err) {
            
            console.error("Collection allocation file Error ", err)
            res.json({"result" : "fail"})
            return;
        }

        // var dict = JSON.parse(file)
        // var headers = []
        
        // for (key in dict) {
        //     headers.push(dict[key])
        // }
    })

    res.json({"result" : "ok"})
})

module.exports = router;