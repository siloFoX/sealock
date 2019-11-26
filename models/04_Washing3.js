// models/04_Washing3.js
 // "세정3" : ["실험날짜", "실험자명", "해당실험기판번호", "실험장비", "실험도구", "UP", "온도", "시간", "사진", "비고"],
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var Washing3 = new Schema({
    _id:ObjectId,
    실험날짜:String,
    실험자명:String,
    해당실험기판번호:String,
    실험장비:String,
    실험도구:String,
    UP:String,
    온도:String,
    시간:String,
    사진:String,
    비고:String
})

module.exports = mongoose.model('Washing3', Washing3);