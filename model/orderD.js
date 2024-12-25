const mongoose = require('../config/config')

const OrderSchema = new mongoose.Schema({
  customers_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'customers',
    required: true
  },
  address_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'address',
    required: true
  },
  cart_id: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'cart',
    required: true
  }],
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'shipped', 'delivered' , 'Order Cancelled'],
    default: 'pending'
  },
  payment_method: {
    type: String,
    enum: ['cashondelivery', 'onlinepayment'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: function(date) {
      return date.toLocaleDateString();
    }
  },
  order_items: [{
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product'
    },

    title: {
      type: String,
      trim: true,
      required: true
    },
    image: [{ type: String }],

    category: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    }
  }],
  
  discount: {
    type: Number,
    default: 0
  }
});
  
  const collectionorder = new mongoose.model("order" , OrderSchema)
  

module.exports =  collectionorder 


