// routes/table.js

var express = require('express');
var router = express.Router();

const fs = require('fs-extra'); // file system
const MongoClient = require('mongodb').MongoClient; //  deprecated


router.post('/', function (req, res) {
    console.log("save query is requested")

    var rawReq = req.body

    var process = rawReq["process"]
    var header = JSON.parse(rawReq["headers"]) // key value
    var table = JSON.parse(rawReq["data"])
    
    // process name mapping Korean -> English
    fs.readFile('../collection_allocate.json', function(err, file) { 
        
        if(err) {
            console.error("Collection allocation Error ", err)
            res.json({"result" : "fail"})
            return;
        }

        var dict = JSON.parse(file);
        var collection = dict[process] // mapping

        // DB part
        // connect DB
        MongoClient.connect('mongodb://223.194.70.112:27017/SmartPorcess', {useNewUrlParser : true, useUnifiedTopology : true}, function (err, client) {
            if(err) {
                console.error("Mongodb connection Error ", err)
                res.json({"result" : "fail"})
                return;
            }

            var success = true // if error occur, success = false 

            for (tableIdx in table){ // tableIdx(index) : 0 ~ table.size() - 1 
                var queryTable = {} 
                var tableRow = table[tableIdx] // deal row by row

                if (tableRow[0] === null){ // if date information is empty, ignore this query
                    continue;
                }

                // queryTable = { "header[i]" : "A[i]_data", "header[i]" : "B[i]_data", ... }
                for (var idx = 0; idx < header.length; idx++){
                    if(header[idx] == ""){
                        break;
                    }
                    else{
                        queryTable[header[idx]] = tableRow[idx]    
                    }
                }

                console.log(queryTable) 

                // send one query
                client.db("SmartProcess").collection(collection).insertOne(queryTable, function (err) {
                    if(err) {
                        console.error("Query Error ", err)
                        success = false
                    }
                    else{
                        console.log("Query Successs")
                    }
                });
            }

            // response to client
            if(success) {
                res.json({"result" : "ok"})
            }
            else {
                res.json({"result" : "fail"})
            }
        });
    });

    // TODO : make log file

    // fs.appendFile('./logs/logs.txt', JSON.stringify(req.body), 'utf8', function (err) {
    //     if (err) {
    //         console.error(err)
    //     }
    // })

})

module.exports = router;