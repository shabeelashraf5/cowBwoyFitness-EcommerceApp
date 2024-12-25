const mongoose = require('../config/config')

    const AddressSchema = new mongoose.Schema({
        
        customers_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'customers',
            required: true
        },
        
       address: [{
        country: {type: String, required: true},
        fname: {type: String, required: true},
        lname: {type: String, required: true},
        address: {type: String, required: true},
        city: {type: String, required: true},
        state: {type: String, required: true},
        phone: {type: Number, required: true}

    }]
      
    })


const collectionaddress = new mongoose.model("address" , AddressSchema)

module.exports =  collectionaddress