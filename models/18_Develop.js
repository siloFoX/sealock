// models/18_Develop.js
// "현상" : ["실험날짜", "실험자명", "해당실험기판번호", "실험도구", "용매", "용매순도", "온도", "시간", "사진", "비고"]
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var Develop = new Schema({
    _id:ObjectId,
    실험날짜:String,
    실험자명:String,
    해당실험기판번호:String,
    실험도구:String,
    용매:String,
    용매순도:String,
    온도:String,
    시간:String,
    사진:String,
    비고:String
})

module.exports = mongoose.model('Develop', Develop, 'Develop');