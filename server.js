// server.js

// front
const bodyParser = require('body-parser'); // POST : resolution for request body vanishing 
const express = require('express'); // web framework
const app = express(); 

// db connection
//const mongo = require('mongodb') 
//const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');

// file and query
app.use(express.static(__dirname + '/public')); // default directory for both client and server
app.use(bodyParser.urlencoded({extended:true})); // extended url encoding 
app.use(bodyParser.json()); // default format of body

// Configure router module
// app.use('/flights', require('./routes/round_index'));
app.use('/', require('./routes/main'));
app.use('/file', require('./routes/file'));
app.use('/memo', require('./routes/memo'));
app.use('/process', require('./routes/process'));
app.use('/table', require('./routes/table'));
app.use('/update', require('./routes/update'));

// Define Model
// var Flight = require('./models/flight');

// Node.js의 native Promise 사용
mongoose.Promise = global.Promise;

// web engine
app.engine('html', require('ejs').__express);

// web settings
app.set('views', __dirname + '/views'); // default directiory for rendering
app.set('view engine', 'ejs'); // set engine

app.listen(3000); // port number

console.log('Server running on port 3000'); // start sign