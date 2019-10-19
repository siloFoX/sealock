var fs = require('fs-extra');
var path = require('path');
var bodyParser = require('body-parser');
var express = require('express');
var formidable = require('formidable');
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

    fs.readFile('./collection_allocate.json', function(err, file) {
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


    // fs.appendFile('./logs/logs.txt', JSON.stringify(req.body), 'utf8', function (err) {
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

    fs.readFile('./collection_allocate.json', function(err, file) {
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

    fs.readFile('./collection_allocate.json', function(err, file) {
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

            console.log("Query end")
        });
    });
})

app.post('/file', function (req, res) {
    var form = new formidable.IncomingForm();

    form.uploadDir = './files'
    form.keepExtensions = true

    form.on('file', function(field, value) {
        console.log(field + " : " + value.name)
        fs.rename(value.path, form.uploadDir + '/' + value.name);
    });

    form.on('end', function(field, value) {
        console.log("file transmition end")
    });

    form.on('error', function(err) {
        if(err) {
            console.error("file transmition Error ", err)
            res.json({"result" : "fail"})
            return;
        }
    });

    form.parse(req, function(err, field, file) {
        if(err) {
            console.error("file parsing Error : ", err)
            res.json({"result" : "fail"})
            return;
        }

        var file_name = file["file"].name
        var splited_name = file_name.split("_")
        var file_path = path.join(__dirname, "files", file_name)

        var process = splited_name[0]
        var object_query = {}
        object_query["_id"] = new mongo.ObjectID(splited_name[1])

        fs.readFile('./collection_allocate.json', function(err, file) {
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

                client.db("SmartProcess").collection(collection).updateOne(object_query, { $set : { "사진" : file_path } }, function (err) {
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

app.listen(3000);

console.log('Server running on port 3000');