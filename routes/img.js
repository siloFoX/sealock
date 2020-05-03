// router/img.js
// img transmition

var express = require('express');
var router = express.Router();

const fs = require('fs-extra');

router.get('/', function(req, res) {

    let objectid = req.query.name
    let is_success = false
    
    fs.readdir('./public/images', function(err, filelist){
    
        for (let idx in filelist) {

            let file_name = filelist[idx]

            if(file_name.indexOf(objectid) !== -1) {

                fs.readFile('./public/images/' + file_name, function(err, file) {

                    if(err) {
                        console.error("There is no image ", err)
                    }

                    res.writeHead(200, {'Content-type' : 'text/html'})
                    res.end(file)
                    // console.log("send image " + file_name)
                    is_success = true
                })
                
                return;
            }
        }

        if(!is_success) {
            
            res.writeHead(404)
            res.end("fail")
        }
    })
})

module.exports = router;