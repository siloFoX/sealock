    // models/Applying_silver_paste.js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
//
var Applying_silver_paste = new Schema({
    _id:ObjectId,
    실험날짜:String,
    실험자명:String,
    해당실험기판번호:String,
    실험도구:String,
    재료:String,
    사진:String,
    비고:String
})

module.exports = mongoose.model('Applying_silver_paste', Applying_silver_paste);