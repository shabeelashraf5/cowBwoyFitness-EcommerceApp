const mongoose = require('../config/config')

    const WishlistSchema = new mongoose.Schema({
        
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


    })

const collectionwishlist = new mongoose.model("wishlist" , WishlistSchema)




module.exports =  collectionwishlist