// routes/memo.js
// post memo and update memo(in upload mode)

var express = require('express');
var router = express.Router();

const fs = require('fs-extra'); // file system

// POST : update memo
router.post('/', function(req, res) {
    var rawReq = req.body

    var process = rawReq["process"] // process in memo is Korean so don't have to convert to English
    var data = rawReq["data"]

    // read entire memo
    fs.readFile('./public/json/memo.json', function(err, file) { 
        if(err) {
            console.error("Memo file read Error ", err)
            res.json({"result" : "fail"})
            return;
        }

        var memo = JSON.parse(file)

        memo[process] = data // change just one part(one process)

        // overwrite the file
        fs.writeFile('./public/json/memo.json',JSON.stringify(memo) , function(err) {
            if (err) {
                console.error("Memo file write Error ", err)
                res.json({"result" : "fail"})
            }
            res.json({"result" : "ok"})
        })
    });

    console.log("Memo changed : " + JSON.stringify(rawReq))
})

module.exports = router;
