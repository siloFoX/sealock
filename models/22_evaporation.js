// models/22_evaporation.js
// "이베포레이션" : ["실험날짜", "실험자명", "해당실험기판번호", "실험장비", "시편번호", "증착재료", "재료순도", "압력", "두께", "사진", "비고"],
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var evaporation = new Schema({
    _id:ObjectId,
    실험날짜:String,
    실험자명:String,
    해당실험기판번호:String,
    실험장비:String,
    시편번호:String,
    증착재료:String,
    재료순도:String,
    압력:String,
    두께:String,
    사진:String,
    비고:String
})

module.exports = mongoose.model('evaporation', evaporation);