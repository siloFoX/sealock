// models/19_Cleaning_after_develop.js
// "현상후세정" : ["실험날짜", "실험자명", "해당실험기판번호", "용매", "UP", "온도", "사진", "비고"]
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var Cleaning_after_develop = new Schema({
    _id:ObjectId,
    실험날짜:String,
    실험자명:String,
    해당실험기판번호:String,
    용매:String,
    UP:String,
    온도:String,
    사진:String,
    비고:String
})

module.exports = mongoose.model('Cleaning_after_develop', Cleaning_after_develop, 'Cleaning_after_develop');