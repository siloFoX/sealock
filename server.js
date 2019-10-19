var fs = require('fs');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();

var mongo = require('mongodb')
var MongoClient = require('mongodb').MongoClient;

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.engine('html', require('ejs').__express);

app.set('views', __dirname + '/views');

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('index');
})

// app.get('/update', function(req, res) {
//     var rawReq = req.body
// })

app.post('/table', function (req, res) {
    console.log("save query is requested")

    var rawReq = req.body

    var process = rawReq["process"]
    var header = JSON.parse(rawReq["headers"])
    var table = JSON.parse(rawReq["data"])

    // console.log(process)
    // console.log(header)
    // console.log(header.length)
    // console.log(table)

    fs.readFile('./query/collection_allocate.json', function(err, file) {
        if(err) {
            console.error("Collection allocation Error ", err)
            res.json({"result" : "fail"})
            return;
        }

        var dict = JSON.parse(file);
        var collection = dict[process]

        // console.log(collection)

        MongoClient.connect('mongodb://localhost:27017/SmartPorcess', {useNewUrlParser : true, useUnifiedTopology : true}, function (err, client) {
            if(err) {
                console.error("Mongodb connection Error ", err)
                res.json({"result" : "fail"})
                return;
            }

            var success = true

            for (tableIdx in table){
                var queryTable = {}
                var tableRow = table[tableIdx]

                if (tableRow[0] === null){
                    continue;
                }

                for (var idx = 0; idx < header.length; idx++){
                    if(header[idx] == ""){
                        break;
                    }
                    else{
                        queryTable[header[idx]] = tableRow[idx]    
                    }
                }

                console.log(queryTable)

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

            if(success) {
                res.json({"result" : "ok"})
            }
            else {
                res.json({"result" : "fail"})
            }
        });
    });


    // fs.appendFile('./stored_data/logs.txt', JSON.stringify(req.body), 'utf8', function (err) {
    //     if (err) {
    //         console.error(err)
    //     }
    // })

})

app.post('/memo', function(req, res) {
    var rawReq = req.body

    var process = rawReq["process"]
    var data = rawReq["data"]

    console.log("Memo changed : " + JSON.stringify(rawReq))

    fs.readFile('./public/json/memo.json', function(err, file) {
        if(err) {
            console.error("Memo file read Error ", err)
            res.json({"result" : "fail"})
            return;
        }

        var memo = JSON.parse(file)

        memo[process] = data

        fs.writeFile('./public/json/memo.json',JSON.stringify(memo) , function(err) {
            if (err) {
                console.error("Memo file write Error ", err)
                res.json({"result" : "fail"})
            }
            res.json({"result" : "ok"})
        })
    });
})

app.post('/process', function(req, res) {
    var rawReq = req.body

    var process = rawReq["process"]

    // console.log(req.body)

    fs.readFile('./query/collection_allocate.json', function(err, file) {
        if(err) {
            console.error("Collection allocation Error ", err)
            res.json({"result" : "fail"})
            return;
        }

        var dict = JSON.parse(file);
        var collection = dict[process]
        
        MongoClient.connect('mongodb://localhost:27017/SmartPorcess', {useNewUrlParser : true, useUnifiedTopology : true}, function (err, client) {
            if(err) {
                console.error("Mongodb connection Error ", err)
                res.json({"result" : "fail"})
                return;
            }

            client.db("SmartProcess").collection(collection).find({}).toArray(function(err, result) {
                if(err) {
                    console.error("Collection find Error : ", err)
                    res.json({"result" : "fail"})
                }
                else if (!result[0]) {
                    console.error("There's no Collection that name")
                    res.json({"result" : "fail"})
                }
                else {
                    // console.log(result)
                    console.log("Update mode : Collection data sending complete")
                    
                    res.json(result)
                }
            });
        });
    });
});

app.post('/update', function (req, res) {
    console.log("save query is requested")

    var rawReq = req.body

    var process = rawReq["process"]
    var header = JSON.parse(rawReq["headers"])
    var table = JSON.parse(rawReq["data"])

    // console.log(process)
    // console.log(header)
    // console.log(header.length)
    // console.log(table)

    fs.readFile('./query/collection_allocate.json', function(err, file) {
        if(err) {
            console.error("Collection allocation Error ", err)
            res.json({"result" : "fail"})
            return;
        }

        var dict = JSON.parse(file);
        var collection = dict[process]

        // console.log(collection)

        MongoClient.connect('mongodb://localhost:27017/SmartPorcess', {useNewUrlParser : true, useUnifiedTopology : true}, function (err, client) {
            if(err) {
                console.error("Mongodb connection Error ", err)
                res.json({"result" : "fail"})
                return;
            }

            var success = true

            for (tableIdx in table){
                var object_id = null
                var object_query = {}
                var queryTable = {}
                var tableRow = table[tableIdx]

                if (tableRow[0] === null){
                    continue;
                }

                object_id = tableRow[0]
                object_query["_id"] = new mongo.ObjectID(object_id)

                console.log(object_query)

                for (var idx = 1; idx < header.length; idx++){
                    if(header[idx] == ""){
                        break;
                    }
                    else{
                        queryTable[header[idx]] = tableRow[idx]    
                    }
                }

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
                
                client.db("SmartProcess").collection(collection).updateOne(object_query, { $set : queryTable }, function (err) {
                    if(err) {
                        console.error("Query Error ", err)
                        success = false
                    }
                    else {
                        console.log("Query Successs")
                        console.log("|")
                    }
                });

                console.log(queryTable)
            }

            if(success) {
                res.json({"result" : "ok"})
            }
            else {
                res.json({"result" : "fail"})
            }
        });
    });
})

// var multer = require('multer');
// var path = require('path');

// var storage = multer.diskStorage({
//     destination : './public/uploads/',
//     filename : (req, file, cb) => {
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
// });

// var upload = multer({
//     storage : storage,
//     limits : {fileSize : 3000000},
// }).single('image');

// app.post('/upload', (req, res) => {
//     upload(req, res, (err) => {
//         if(err) {
//             res.render('index', {msg : err});
//         }
//         else {
//             if(req.file == undefined) {
//                 res.render('index', {msg : 'No file Selected'});
//             }
//             else {
//                 res.render('index', {
//                     msg : 'file uploaded',
//                     file : `uploads/${req.file.filename}`
//                 })
//             }
//         }
//     })
// });

app.listen(3000);

console.log('Server running on port 3000');