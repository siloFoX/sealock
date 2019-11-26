//  querys/findToArray.js
//  TODO implemented
var mongoose = require('mongoose');

function findToArray (model) {
    return model.find().exec(
        toarray()
    )
}



