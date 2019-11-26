// models/06_Cleaning_blowing.js
// "세정블로윙" : ["실험날짜", "실험자명", "해당실험기판번호", "실험도구", "가스", "순도", "온도", "사진", "비고"],
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var Cleaning_blowing = new Schema({
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

module.exports = mongoose.model('Cleaning_blowing', Cleaning_blowing, 'Cleaning_blowing');