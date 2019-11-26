// models/27_Dry_silver_paste.js
// "실버페이스트건조" : ["실험날짜", "실험자명", "해당실험기판번호", "실험도구", "사진", "비고"]
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var Dry_silver_paste = new Schema({
    _id:ObjectId,
    실험날짜:String,
    실험자명:String,
    해당실험기판번호:String,
    실험도구:String,
    사진:String,
    비고:String
})

//find All
Dry_silver_paste.statics.findAll = function() {
    return this.find({});
}

module.exports = mongoose.model('Dry_silver_paste', Dry_silver_paste, 'Dry_silver_paste');