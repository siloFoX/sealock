// router/search.js

var express = require('express');
var router = express.Router();

const fs = require('fs-extra');
const path = require('path');
const mongoClient = require('mongodb').MongoClient;

// GET : search
router.get('/', function (req, res) {
    console.log("Search mode on")
    res.render('search');
})

router.post('/', function (req, res) {

    var rawReq = req.body

    console.log("Print query : " + JSON.stringify(rawReq))
    // console.log(rawReq["start-date"])
    // console.log(rawReq["end-date"])

    fs.readFile("./collection_allocate.json", (err, file) => {
        
        if(err) {
            
            console.error("Collection allocation file Error ", err)
            res.json({"result" : "fail"})
            return;
        }

        var dict = JSON.parse(file)

        mongoClient.connect('mongodb://localhost:27017/Locke', {useNewUrlParser : true, useUnifiedTopology : true}, function (err, client) {
            if(err) {
                console.error("Mongodb connection Error ", err)
                res.json({"result" : "fail"})
                return;
            }

            var dateList = []

            for (date = parseInt(rawReq["start-date"]); date < parseInt(rawReq["end-date"]) + 1; date++) 
                dateList.push(String(date))

            var query = {$and : [{"실험자명" : rawReq["name"]}, {"실험날짜" : {$in : dateList}}]}
            var resultList = []

            let val_array = Object.values(dict)
        
            for (let val_idx = 0; val_idx < val_array.length; val_idx++) {

                console.log(val_array[val_idx] + " query finished")
                    
                client.db("Locke").collection(val_array[val_idx]).find(query).toArray(function(err, result) {
        
                    if(err) {
                        console.error("Query Error ", err)
                    }
                    else if(!result[0]) {
                    }
                    else {
                        
                        for (let idx = 0; idx < result.length; idx++) {
        
                            let result_tmp = result[idx]
                            result[idx] = {}
                            result[idx]["공정"] = val_array[val_idx]
                            
                            for(let key_tmp in result_tmp) 
                                result[idx][key_tmp] = result_tmp[key_tmp]
                            
        
                            delete result[idx]._id
        
                            resultList.push(result[idx])
                        }
                    }

                    if(val_idx == val_array.length - 1) {

                        console.log(resultList.length + " is found")

                        let file_str = "["

                        for (let idx = 0; idx < resultList.length; idx++) {

                            file_str += "\n\t" + JSON.stringify(resultList[idx]) + ","

                            if(idx == resultList.length - 1) {

                                fs.writeFile("./public/json/print.json", file_str.slice(0, -1) + "\n]", function(err) {
                                    if(err) {
                                        console.error("File Error ", err)
                                        return;
                                    }
                                })

                                console.log("Make print data success")
                                res.json({"result" : "ok"})
                            }
                        }
                    }
                });
            }
        });
    })
})


module.exports = router;