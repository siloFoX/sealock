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

    fs.readFile("./collection_allocate.json", (err, file) => {
        
        if(err) {
            
            console.error("Collection allocation file Error ", err)
            res.json({"result" : "fail"})
            return;
        }

        var dict = JSON.parse(file)

        mongoClient.connect('mongodb://localhost:20017/Locke', {useNewUrlParser : true, useUnifiedTopology : true}, function (err, client) {
            if(err) {
                console.error("Mongodb connection Error ", err)
                res.json({"result" : "fail"})
                return;
            }

            var dateList = []


            // *** This is rough iteration form from date queries
            // So it has to be chaged ***
            for (date = parseInt(rawReq["start-date"]); date < parseInt(rawReq["end-date"]) + 1; date++) 
                dateList.push(String(date))

            // query table
            var query = {$and : [{"실험자명" : rawReq["name"]}, {"실험날짜" : {$in : dateList}}]}
            var resultList = []

            let val_array = Object.values(dict)
        
            // Make result list from result of each query
            for (let val_idx = 0; val_idx < val_array.length; val_idx++) {

                console.log(val_array[val_idx] + " query finished")
                    
                client.db("Locke").collection(val_array[val_idx]).find(query).toArray(function(err, result) {
        
                    if(err) {
                        console.error("Query Error ", err)
                        res.json({"result" : "fail"})
                        return;
                    }
                    else if(!result[0]) {
                        console.log("Error : There is no data. Please check the DB meta data")
                    }
                    else {
                        
                        for (let idx = 0; idx < result.length; idx++) {
        
                            let result_tmp = result[idx]
                            result[idx] = {}
                            result[idx]["공정"] = val_array[val_idx]
                            
                            // !! Important order of key list (Because of the print page)
                            for(let key_tmp in result_tmp) 
                                result[idx][key_tmp] = result_tmp[key_tmp]
        
                            resultList.push(result[idx])
                        }
                    }

                    // Construct Json file in public/json/print.js for print page
                    if(val_idx == val_array.length - 1) {

                        console.log(resultList.length + " is found")

                        if(!resultList.length)
                            res.json({"result" : "fail"})

                        let file_str = "["

                        for (let idx = 0; idx < resultList.length; idx++) {

                            file_str += "\n\t" + JSON.stringify(resultList[idx]) + ","

                            if(idx == resultList.length - 1) {

                                fs.writeFile("./public/json/print.json", file_str.slice(0, -1) + "\n]", function(err) {
                                    if(err) {
                                        console.error("File Error ", err)
                                        res.json({"result" : "fail"})
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