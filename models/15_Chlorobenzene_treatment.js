// models/15_Chlorobenzene_treatment.js
// "클로로벤젠처리" : ["실험날짜", "실험자명", "해당실험기판번호", "실험장비", "실험도구", "용매", "용매순도", "용매구입일", "용매개봉일", "용매소분일", "온도", "시간", "사진", "비고"]
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var Chlorobenzene_treatment = new Schema({
    _id:ObjectId,
    실험날짜:String,
    실험자명:String,
    해당실험기판번호:String,
    실험장비:String,
    실험도구:String,
    용매:String,
    용매순도:String,
    용매구입일:String,
    용매개봉일:String,
    용매소분일:String,
    온도:String,
    시간:String,
    사진:String,
    비고:String
})

module.exports = mongoose.model('Chlorobenzene_treatment', Chlorobenzene_treatment);