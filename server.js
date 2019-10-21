var fs = require('fs');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');


const storage = multer.diskStorage({
    destination:'./public/uploads/',
    filename: (req,file,cb)=>{
        cb(null, file.fieldname+ '-' + Date.now()+ path.extname(file.originalname));
    }
});

const upload = multer({
    storage:storage,
    limits: {fileSize:3000000},
}).single('image');



app.set('view engine', 'ejs');

app.use(express.static('./public'));

app.get ('/',(req,res) => res.render('index'));

app.post('/upload',(req,res) =>{
    upload(req,res,(err) =>  {
        if(err){
            res.render('index',{msg:err});
        }else{
            if(req.file == undefined){
                res.render('index',{msg:'No file Selected'});
            } else{
                res.render('index',{
                    msg:"file uploaded",
                    file: `uploads/${req.file.filename}`
                })
            }
        }
    })

});

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

app.post('/ajax', function (req, res) {
    console.log("save query is requested")

    var rawRes = req.body

    var process = rawRes[0][0]
    var header = rawRes[1]
    var table = rawRes.slice(2)[0]

    // console.log(process)
    // console.log(header)
    // console.log(header.length)
    // console.log(table)

    fs.readFile('./query/collection_allocate.json', function(err, file) {
        if(err) {
            console.error("Collection allocation Error ", err)
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

                        res.json({"result" : "fail"})
                    }
                    else{
                        console.log("Query Successs")

                        res.json({"result" : "ok"})
                    }
                });
            }
        });
    });


    // fs.appendFile('./stored_data/logs.txt', JSON.stringify(req.body), 'utf8', function (err) {
    //     if (err) {
    //         console.error(err)
    //     }
    // })

})


app.listen(3000);

console.log('Server running on port 3000');