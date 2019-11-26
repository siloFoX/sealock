// models/09_Heat_treatment.js
// "열처리" : ["실험날짜", "실험자명", "해당실험기판번호", "실험장비", "실험도구", "온도", "시간[sec]", "가스", "가스순도", "가스유량", "압력", "사진", "비고"]
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var Heat_treatment = new Schema({
    _id:ObjectId,
    실험날짜:String,
    실험자명:String,
    해당실험기판번호:String,
    실험장비:String,
    실험도구:String,
    온도:String,
    '시간[sec]':String,
    가스:String,
    가스순도:String,
    가스유량:String,
    압력:String,
    사진:String,
    비고:String
})

module.exports = mongoose.model('Heat_treatment', Heat_treatment, 'Heat_treatment');