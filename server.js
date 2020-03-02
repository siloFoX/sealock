// server.js

// front
const bodyParser = require('body-parser'); // POST : resolution for request body vanishing 
const express = require('express'); // web framework
const app = express(); 
const mongoose = require('mongoose');

//const mongo = require('mongodb') 
//const MongoClient = require('mongodb').MongoClient;
// CONNECT TO MONGODB SERVER 223.194.70.112
mongoose.connect("mongodb://"+"223.194.70.112:27017/Locke", {
   socketTimeoutMS: 0,
   keepAlive: true,
   reconnectTries: 30,
   useUnifiedTopology: true,
   useNewUrlParser: true
   })
  .then(() => console.log('Successfully connected to mongodb'))
  .catch(e => console.error(e));

// Node.js의 native Promise 사용
mongoose.Promise = global.Promise;


// file and query
app.use(express.static(__dirname + '/public')); // default directory for both client and server
app.use(bodyParser.urlencoded({extended:true})); // extended url encoding 
app.use(bodyParser.json()); // default format of body

// Define Model
// var Flight = require('./models/flight');

// web engine
app.engine('html', require('ejs').renderFile);

// web settings
app.set('views', __dirname + '/views'); // default directiory for rendering
app.set('view engine', 'ejs'); // set engine
app.use('/', require('./routes/main')); // main page setting

// Configure router module
// app.use('/flights', require('./routes/round_index'));
app.use('/table', require('./routes/table'));
app.use('/process', require('./routes/process'));
app.use('/file', require('./routes/file'));
app.use('/memo', require('./routes/memo'));
app.use('/update', require('./routes/update'));

app.listen(3000); // port number

console.log('Server running on port 3000'); // start sign
