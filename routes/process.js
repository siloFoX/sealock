// routes/table.js
// first page GET table

var express = require('express');
var router = express.Router();

const fs = require('fs-extra'); // file system
const MongoClient = require('mongodb').MongoClient; //  deprecated

// POST : send all data from DB's each process
router.post('/', function(req, res) {
    var rawReq = req.body

    var process = rawReq["process"]

    fs.readFile('./collection_allocate.json', function(err, file) { // convert KR -> EN
        if(err) {
            console.error("Collection allocation Error ", err)
            res.json({"result" : "fail"})
            return;
        }

        var dict = JSON.parse(file)
        var collection = dict[process]
        
        // DB query
        MongoClient.connect('mongodb://http://223.194.70.112/:27017/Locke', {useNewUrlParser : true, useUnifiedTopology : true}, function (err, client) {
            if(err) {
                console.error("Mongodb connection Error ", err)
                res.json({"result" : "fail"})
                return;
            }

            // send all data from process
            client.db("Locke").collection(collection).find({}).toArray(function(err, result) {
                if(err) {
                    console.error("Collection find Error : ", err)
                    res.json({"result" : "fail"})
                }
                else if (!result[0]) { // If query wrong collection(process) name, It return "{}" not undefined. So I this could happen
                    console.error("There's no Collection has that name") // or no data in DB
                    res.json({"result" : "ok"})
                }
                else {
                    console.log("Collection data sending complete")
                    
                    res.json(result)
                }
            });
        });
    });
});

module.exports = router;