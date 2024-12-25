const mongoose = require('../config/config')

const CategorySchema = new mongoose.Schema({

    title: {type: String, unique: true , required: true } ,
    active: {type: Boolean, default: true},

})

const collectioncategory=new mongoose.model("category" , CategorySchema)

module.exports =  collectioncategory 


