// models/25_Oxide_removal.js
// "산화막제거" : ["실험날짜", "실험자명", "해당실험기판번호", "실험도구", "사진", "비고"],
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var Oxide_removal = new Schema({
    _id:ObjectId,
    실험날짜:String,
    실험자명:String,
    해당실험기판번호:String,
    실험도구:String,
    사진:String,
    비고:String
})

module.exports = mongoose.model('Oxide_removal', Oxide_removal);