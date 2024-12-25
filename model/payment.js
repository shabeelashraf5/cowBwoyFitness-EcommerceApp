const mongoose = require('../config/config')

const PaymentSchema = new mongoose.Schema({

    title: {type: String, unique: true , required: true } 

})

const collectionpayment=new mongoose.model("payment" , PaymentSchema)

module.exports =  collectionpayment


