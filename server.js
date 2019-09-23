var fs = require('fs');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();

// var mongoose = require('mongoose');
// mongoose.Promise = global.Promise;

// var dbURL = 'http://localhost:27017'

// mongoose.connect(dbURL, )

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
    var table = rawRes.slice(2)

    console.log(process)
    console.log(header)
    console.log(table)

    fs.appendFile('./stored_data/logs.txt', JSON.stringify(req.body), 'utf8', function (err) {
        if (err) {
            console.error(err)
        }
    })
})


app.listen(3000);

console.log('Server running on port 3000');