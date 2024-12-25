const mongoose = require('../config/config')

const CouponSchema = new mongoose.Schema({

    code: {type: String, unique: true , required: true } ,
    price: {type: Number, required: true },
    usedBy: [{type: mongoose.Schema.Types.ObjectId, ref: 'customer'}]

})

const collectioncoupon=new mongoose.model("coupon" , CouponSchema)

module.exports =  collectioncoupon