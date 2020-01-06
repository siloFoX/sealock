// routes/update.js
// update table

var express = require('express');
var router = express.Router();

const fs = require('fs-extra'); // file system
const mongo = require('mongodb') 
const MongoClient = require('mongodb').MongoClient; //  deprecated

// POST : update query at each process
router.post('/', function (req, res) {
    console.log("save query is requested")

    var rawReq = req.body

    var process = rawReq["process"]
    var header = JSON.parse(rawReq["headers"])
    var table = JSON.parse(rawReq["data"])

    fs.readFile('./collection_allocate.json', function(err, file) { // convert KR -> EN
        if(err) {
            console.error("Collection allocation Error ", err)
            res.json({"result" : "fail"})
            return;
        }

        var dict = JSON.parse(file);
        var collection = dict[process]

        // DB
        MongoClient.connect('mongodb://localhost:27017/SmartPorcess', {useNewUrlParser : true, useUnifiedTopology : true}, function (err, client) {
            if(err) {
                console.error("Mongodb connection Error ", err)
                res.json({"result" : "fail"})
                return;
            }

            var success = true

            for (tableIdx in table){
                var object_id = null // use object_ID for find place which We want to update
                var object_query = {} // query for find
                var queryTable = {} // query for update
                var tableRow = table[tableIdx]

                if (tableRow[0] === null){ // Can't find without object_ID
                    continue;
                }

                object_id = tableRow[0]
                object_query["_id"] = new mongo.ObjectID(object_id) // MongoDB's ObjectID format

                console.log("finding for update : " + object_query)

                for (var idx = 1; idx < header.length; idx++){
                    if(header[idx] == ""){ // break for strange headers
                        break;
                    }
                    else{
                        queryTable[header[idx]] = tableRow[idx]
                    }
                }

                // data which wants to change
                client.db("SmartProcess").collection(collection).find(object_query).toArray(function(err, result) {
                    if(err) {
                        console.error("Query Error ", err)
                        success = false
                    }
                    else if(!result[0]) {
                        console.log("Object not found")
                        success = false
                    }
                    else {
                        console.log(result)
                        console.log("Object found")
                        console.log("==>")
                    }
                });
                
                // change data
                client.db("SmartProcess").collection(collection).updateOne(object_query, { $set : queryTable }, function (err) {
                    if(err) {
                        console.error("Query Error ", err)
                        success = false
                    }
                    else {
                        console.log("Query Successs")
                    }
                });

                // see how it changed
                console.log(queryTable)
            }

            console.log("Query end")

            if(success) {
                res.json({"result" : "ok"})
            }
            else {
                res.json({"result" : "fail"})
            }
        });
    });
})

module.exports = router;