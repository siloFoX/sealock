// models/21_Sample_preparation_for_evaporation.js
// "이베포레이션샘플거치" : ["실험날짜", "실험자명", "해당실험기판번호", "실험도구", "사진", "비고"],
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var Sample_preparation_for_evaporation = new Schema({
    _id:ObjectId,
    실험날짜:String,
    실험자명:String,
    해당실험기판번호:String,
    실험도구:String,
    사진:String,
    비고:String
})

module.exports = mongoose.model('Sample_preparation_for_evaporation', Sample_preparation_for_evaporation, 'Sample_preparation_for_evaporation');