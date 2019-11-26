// models/20_Blowing_after_develop_cleaning.js
// "현상액세정후블로윙" : ["실험날짜", "실험자명", "해당실험기판번호", "실험도구", "가스", "순도", "온도", "사진", "비고"]
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var Blowing_after_develop_cleaning = new Schema({
    _id:ObjectId,
    실험날짜:String,
    실험자명:String,
    해당실험기판번호:String,
    실험도구:String,
    가스:String,
    순도:String,
    온도:String,
    사진:String,
    비고:String
})

module.exports = mongoose.model('Blowing_after_develop_cleaning', Blowing_after_develop_cleaning, 'Blowing_after_develop_cleaning');