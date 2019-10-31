// front
var fs = require('fs-extra'); // file system
var path = require('path'); 
var bodyParser = require('body-parser'); // POST : resolution for request body vanishing 
var express = require('express'); // web framework
var formidable = require('formidable'); // receive data from form
var app = express(); 

// back
var mongo = require('mongodb') 
var MongoClient = require('mongodb').MongoClient;

// file and query
app.use(express.static(__dirname + '/public')); // default directory for both client and server
app.use(bodyParser.urlencoded({extended:true})); // extended url encoding 
app.use(bodyParser.json()); // default format of body

// web engine
app.engine('html', require('ejs').__express);

// web settings
app.set('views', __dirname + '/views'); // default directiory for rendering
app.set('view engine', 'ejs'); // set engine

// make 'file' directory
fs.stat('./files', function(err) {
    // when cannot find file
    if(err) { 
        console.log("directory 'files' does not found")

        // when doesn't exist
        if(err.code === "ENOENT") {
            console.log("dir : does not exist")

            // make dir named 'file'
            fs.mkdir('./files', (err) => {
                if(err) {
                    console.error("make dir error ", err)
                }
                else {
                    console.log("dir : make success")
                }
            })
        }
    }
});

// GET
// GET : root 
app.get('/', function (req, res) { 
    res.render('index');
})

// POST
// POST : from table to DB
app.post('/table', function (req, res) {
    console.log("save query is requested")

    var rawReq = req.body

    var process = rawReq["process"]
    var header = JSON.parse(rawReq["headers"]) // key value
    var table = JSON.parse(rawReq["data"])

    fs.readFile('./collection_allocate.json', function(err, file) { // process name mapping Korean -> English
        if(err) {
            console.error("Collection allocation Error ", err)
            res.json({"result" : "fail"})
            return;
        }

        var dict = JSON.parse(file);
        var collection = dict[process] // mapping

        // DB part
        // connect DB
        MongoClient.connect('mongodb://localhost:27017/SmartPorcess', {useNewUrlParser : true, useUnifiedTopology : true}, function (err, client) {
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

// POST : update memo
app.post('/memo', function(req, res) {
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

// POST : send all data from DB's each process
app.post('/process', function(req, res) {
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
        MongoClient.connect('mongodb://localhost:27017/SmartPorcess', {useNewUrlParser : true, useUnifiedTopology : true}, function (err, client) {
            if(err) {
                console.error("Mongodb connection Error ", err)
                res.json({"result" : "fail"})
                return;
            }

            // send all data from process
            client.db("SmartProcess").collection(collection).find({}).toArray(function(err, result) {
                if(err) {
                    console.error("Collection find Error : ", err)
                    res.json({"result" : "fail"})
                }
                else if (!result[0]) { // If query wrong collection(process) name, It return "{}" not undefined. So I this could happen
                    console.error("There's no Collection has that name")
                    res.json({"result" : "fail"})
                }
                else {
                    console.log("Update mode : Collection data sending complete")
                    
                    res.json(result)
                }
            });
        });
    });
});

// POST : update query at each process
app.post('/update', function (req, res) {
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

// POST : upload file
app.post('/file', function (req, res) {
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

        var file_name = file["file"].name // file_name = "process_ObjectID_originalName.extension"
        var splited_name = file_name.split("_") // splited_name = [ "process", "ObjectId", "orginalName.extension" ]
        var file_path = path.join(__dirname, "files", file_name) // where file existing

        var process = splited_name[0]
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

            // DB
            MongoClient.connect('mongodb://localhost:27017/SmartPorcess', {useNewUrlParser : true, useUnifiedTopology : true}, function (err, client) {
                if(err) {
                    console.error("Mongodb connection Error ", err)
                    res.json({"result" : "fail"})
                    return;
                }

                // path is inserted in column "사진" 
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

app.listen(3000); // port number

console.log('Server running on port 3000'); // start sign