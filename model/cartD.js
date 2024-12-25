const mongoose = require('../config/config')

    const CartSchema = new mongoose.Schema({
        
        customers_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'customers',
            required: true
        },

      product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product',
            required: true

        }, 


        quantity: {type: Number, required: true,default: 1
          }


    })



const collectioncart = new mongoose.model("cart" , CartSchema)

module.exports =  collectioncart

