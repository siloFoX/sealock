// models/08_sputtering.js
// "스퍼터링" : ["실험날짜", "실험자명", "해당실험기판번호", "실험장비", "실험도구", "가스1", "가스1 순도", "가스1 유량", "가스2", "가스2 순도", "가스2 유량", "가스3", "가스3 순도", "가스3 유량", "증착재료", "온도", "시간[sec]", "압력[Torr]", "회전속도[rpm]", "파워[W]", "두께[nm]", "사진", "비고"]
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var Sputtering = new Schema({
    _id:ObjectId,
    실험날짜:String,
    실험자명:String,
    해당실험기판번호:String,
    실험장비:String,
    실험도구:String,
    가스1:String,
    '가스1 순도':String,
    '가스1 유량':String,
    가스2:String,
    '가스2 순도':String,
    '가스2 유량':String,
    가스3:String,
    '가스3 순도':String,
    '가스3 유량':String,
    증착재료:String,
    온도:String,
    '시간[sec]':String,
    '압력[Torr]':String,
    '회전속도[rpm]':String,
    '파워[W]':String,
    '두께[nm]':String,
    사진:String,
    비고:String
})

module.exports = mongoose.model('Sputtering', Sputtering);