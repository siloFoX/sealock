// models/01_ample_preparation.js
// "샘플준비" : ["실험날짜", "실험자명", "해당실험기판번호", "기판재료", "사진", "비고"]
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var Sample_preparation = new Schema({
    _id:ObjectId,
    실험날짜:String,
    실험자명:String,
    해당실험기판번호:String,
    기판재료:String,
    사진:String,
    비고:String
})

// send one query(insertOne)
Applying_silver_paste.statics.create = function(payload) {
    const applying_silver_paste = new this(payload);
    return applying_silver_paste.save();
}

//find All
Applying_silver_paste.statics.findAll = function() {
    return this.find({});
}

//return key array
Applying_silver_paste.method.setIndexes = function() {
    var json = this.tree;
    var object = [];
    for (key in json){
        object.push(key);
    }
    object.pop();
    object.pop();
    object.shift();
    return object;
}


module.exports = mongoose.model('Sample_preparation', Sample_preparation, 'Sample_preparation');