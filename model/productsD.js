const mongoose = require('../config/config')

const ProductSchema = new mongoose.Schema({
    
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    title: {type: String, trim: true, required: true } ,
    image: [{type: String}],
    price: {type: Number, required: true },
    description: {type:String, required: true},
    active: {type: Boolean, default: true},
    gender: {
        type: String,
        enum: ['male', 'female'] 
    }

})



const collectionproduct=new mongoose.model("product" , ProductSchema)

module.exports =  collectionproduct