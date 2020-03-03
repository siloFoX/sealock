// router/update.js
// file transmition(in update mode)

var express = require('express');
var router = express.Router();

const fs = require('fs-extra'); // file system
const path = require('path'); 
const formidable = require('formidable'); // receive data from form
const mongo = require('mongodb') 
const MongoClient = require('mongodb').MongoClient; //  deprecated

// POST : upload file
router.post('/', function (req, res) {
    var form = new formidable.IncomingForm(); // use formidable to make our form 

    form.uploadDir = './files' // where it will upload
    form.keepExtensions = true // not change extension

    // deal with file form(field == "file", value is file) 
    form.on('file', function(field, value) {
        console.log(field + " : " + value.name)
        fs.rename(value.path, form.uploadDir + '/' + value.name);
    });

    // logging when file transmition is over
    form.on('end', function(field, value) {
        console.log("file transmition end")
    });

    // error catch
    form.on('error', function(err) {
        if(err) {
            console.error("file transmition Error ", err)
            res.json({"result" : "fail"})
            return;
        }
    });

    // execute file upload formidable
    form.parse(req, function(err, field, file) {
        if(err) {
            console.error("file parsing Error : ", err)
            res.json({"result" : "fail"})
            return;
        }

        var file_name = file["file"].name // file_name = "process_ObjectID_file-info_originalName.extension"
        var splited_name = file_name.split("_") // splited_name = [ "process", "ObjectId", "file-info", "orginalName.extension" ]
        var file_path = path.join(__dirname, "files", file_name) // where file existing

        var process = splited_name[0]
        var column = splited_name[2]
        var object_query = {}
        object_query["_id"] = new mongo.ObjectID(splited_name[1])

        fs.readFile('./collection_allocate.json', function(err, file) { // convert KR -> EN
            if(err) {
                console.error("Collection allocation Error ", err)
                res.json({"result" : "fail"})
                return;
            }
    
            var dict = JSON.parse(file);
            var collection = dict[process]
            var queryTable = {}
            queryTable[column] = file_path

            // DB
            MongoClient.connect('mongodb://223.194.70.112:27017/Locke', {useNewUrlParser : true, useUnifiedTopology : true}, function (err, client) {
                if(err) {
                    console.error("Mongodb connection Error ", err)
                    res.json({"result" : "fail"})
                    return;
                }

                // path is inserted in column  
                client.db("Locke").collection(collection).updateOne(object_query, { $set : queryTable }, function (err) {
                    if(err) {
                        console.error("Input file path Error ", err)
                        res.json({"result" : "fail"})
                    }
                    else {
                        console.log("file path is inserted")
                        res.json({"result" : "ok"})
                    }
                });
            });
        });
    });
});

module.exports = router;