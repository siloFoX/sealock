// models/28_Measure.js
// "측정" : ["실험날짜", "실험자명", "해당실험기판번호", "실험장비", "실험도구", "Mobility", "Vth", "On current", "Off current", "On/Off ratio", "S.S", "사진", "비고"]
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var Measure = new Schema({
    _id:ObjectId,
    실험날짜:String,
    실험자명:String,
    해당실험기판번호:String,
    실험장비:String,
    실험도구:String,
    Mobility:String,
    Vth:String,
    'On current':String,
    'Off current':String,
    'On/Off ratio':String,
    'S.S':String,
    사진:String,
    비고:String
})

//find All
Measure.statics.findAll = function() {
    return this.find({});
}

module.exports = mongoose.model('Measure', Measure);