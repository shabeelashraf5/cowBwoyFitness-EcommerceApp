var express = require('express');
var path = require('path');
const multer = require('multer')


 const storage = multer.diskStorage({
    destination: 'public/images/',
    filename: (req, file, cb) =>{
        cb(null, file.originalname)
    }
})

const upload = multer({
    storage:  storage,
    fileFilter: function(req, file, callback){
        if(
            file.mimetype == "image/jpeg" ||
            file.mimetype == "image/png"
        ){
            callback(null,true)

            }else{
                console.log("Only JPG & PNG file supported")
                const error = new Error("Only JPG and PNG files are supported")
                callback(error, false)
            }
    }
}) 


/*

const storage = multer.diskStorage({
    destination: function(req,file,cb){
  
      cb(null, 'public/photos/')
    },
  
    filename: function(req, file, cb){
  
      cb(null, Date.now() + file.originalname)
    }
  
  }) 


  const upload = multer({
    storage:  storage,
    fileFilter: function(req, file, callback){
        if(
            file.mimetype == "image/jpeg" ||
            file.mimetype == "image/png"
        ){
            callback(null,true)

            }else{
                console.log("Only JPG & PNG file supported")
                callback(null,true)
            }
    }
})


*/

module.exports =  upload