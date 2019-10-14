const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

const storage = multer.diskStorage({
    destination:'./public/uploads/',
    filename: (req,file,cb)=>{
        cb(null, file.fieldname+ '-' + Date.now()+ path.extname(file.originalname));
    }
});

const upload = multer({
    storage:storage,
    limits: {fileSize:3000000},
}).single('image');

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('./public'));

app.get ('/',(req,res) => res.render('index'));

app.post('/upload',(req,res) =>{
    upload(req,res,(err) =>  {
        if(err){
            res.render('index',{msg:err});
        }else{
            if(req.file == undefined){
                res.render('index',{msg:'No file Selected'});
            } else{
                res.render('index',{
                    msg:"file uploaded",
                    file: `uploads/${req.file.filename}`
                })
            }
        }
    })

});

const port = 3000;

app.listen(port,  ()=> console.log('server started on port '+port));