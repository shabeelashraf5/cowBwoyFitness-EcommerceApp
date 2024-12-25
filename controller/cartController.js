var express = require('express');

const collectioncart = require('../model/cartD')
const collectionproduct = require('../model/productsD')
const collectionaddress = require('../model/address');
const collectioncoupon = require('../model/couponD')
const collectionorder = require('../model/orderD')
const Razorpay = require('razorpay')

    const cart = function(req, res) { 
    const customerId = req.session.customerId;
  
    collectioncart
      .find({ customers_id: customerId })
      .populate('product_id')
      .exec(function(err, docs) {
        if (err) {
          console.log(err);
        } else {
          if (docs && docs.length) {
            res.render('cart', {
              cartItems: docs,
              loggedIn: req.session.customerId
            });
          } else {
            res.render('cart', {
              cartItems: [],
              loggedIn: req.session.customerId
            });
          }
        }
      });
  }; 

  

 
  const postCart = function(req, res) {
  const productId = req.body.product_id;
  const customerId = req.session.customerId;
  const quantity = req.body.quantity || 1; 
  const cartItem = new collectioncart({
    customers_id: customerId,
    product_id: productId,
    quantity: quantity 
  });

  cartItem.save()
    .then(() => {
      res.redirect('/cart');
    })
    .catch((err) => {
      console.error(err);
      res.redirect('/login');
    });
}




const updateCart = async function (req, res) {
  const cartItemId = req.params.cartItemId;
  const newQuantity = req.body.quantity;
  let totalAmount = 0;

  try {
    
    const updatedCartItem = await collectioncart.findByIdAndUpdate(
      cartItemId,
      { $set: { quantity: newQuantity } },
      { new: true }
    );

    
    const updatedProduct = await collectionproduct.findById(
      updatedCartItem.product_id
    );

    
    const customerId = req.session.customerId;
    const cartItems = await collectioncart
      .find({ customers_id: customerId })
      .populate("product_id")
      .exec();

    
    cartItems.forEach((cartItem) => {
      const product = cartItem.product_id;
      totalAmount += product.price * cartItem.quantity;
    });

    res.render("cart", {
      cartItems: cartItems,
      subtotal: totalAmount,
      total: totalAmount, 
      loggedIn: req.session.customerId,
    });
  } catch (error) {
    console.error(error);
  }
};


 const deleteCart = function(req,res){

  collectioncart.findByIdAndRemove( req.params.id, (err,docs) =>{

    if(err){
        console.log('Error Occured')
    }else{
        res.redirect('/cart')
    }

})

 }


  const checkout = async function(req, res) {
  const selectedAddressId = req.query.addressId;
  const customerId = req.session.customerId;
  const couponCode = req.query.code;

  try {
    const cartItems = await collectioncart
      .find({ customers_id: customerId })
      .populate('product_id')
      .populate({ path: 'customers_id', select: 'fname lname email' })
      .exec();

      const coupon = await collectioncoupon.findOne({ code: couponCode });

      let discount = 0;
      let subtotal = 0
      let total = 0; 

    
    for (const cartItem of cartItems) {
      const quantity = cartItem.quantity;
      const price = cartItem.product_id.price;
      subtotal += quantity * price;
      total += quantity * price;
    }

    const addressList = await collectionaddress.find({ customers_id: customerId });

      if (coupon && !coupon.usedBy.includes(customerId)) {
      if (subtotal >= 1000) {
        discount = coupon.price;
        total -= discount;
        await collectioncoupon.findByIdAndUpdate(coupon._id, {$push: {usedBy: customerId}});
      } else {
        req.flash('error', 'Minimum purchase of 1000 required to use this coupon.');
      }
    } else if (coupon && coupon.usedBy.includes(customerId)) {
      req.flash('error', 'This coupon has already been used by you.');
    }

    const selectedAddress = await collectionaddress.findOne({_id: selectedAddressId, customers_id: customerId})

    res.render('information2', {
      cartItems: cartItems,
      selectedAddress: selectedAddress,
      addressList: addressList,
      discount: discount,
      loggedIn: req.session.customerId,
      subtotal: subtotal,
      coupon: coupon,
      total: total,
      flash: req.flash() 
    });

    
  } catch (err) {
    console.log(err);
  }
} 




const address = async function (req, res) {
  const customerId = req.session.customerId;
  const data = {
    customers_id: customerId,
    address: {
      country: req.body['address[].country'],
      fname: req.body['address[].fname'],
      lname: req.body['address[].lname'],
      address: req.body['address[].address'],
      city: req.body['address[].city'],
      state: req.body['address[].state'],
      phone: req.body['address[].phone']
    }
  }

  try {
    const addressDoc = await collectionaddress.create(data);
    const addressList = await collectionaddress.find({ customers_id: customerId });
    res.redirect('/checkout');
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

const deleteaddress = function(req, res) {
  const addressId = req.params.id;

  collectionaddress.findByIdAndRemove(addressId, (err, deletedAddress) => {
    if (err) {
      console.log('Error Occured', err);
      res.status(500).send('Error Occured');
    } else {
      console.log('Address deleted:', deletedAddress);
      res.redirect('/checkout');
    }
  });
}

  const placeOrder = async function(req, res) {
  const customerId = req.body.customer_id;
  const addressId = req.body.address_id;
  const cartIds = req.body.cart_id;
  const paymentMethod = req.body.paymentMethod;
  const discount = req.body.discount;

  var instance = new Razorpay({ 
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET })

  try {

    
  
   const cartItems = await collectioncart.find({ customers_id: customerId }).populate({
    path: 'product_id',
    populate: {
      path: 'category_id',
      model: 'category',
      select: 'title'
    }
  }).exec();

    console.log('cartItems:', cartItems); 
   

    const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.product_id.price, 0);
    const total = subtotal - discount;

    const orderItems = cartItems.map(item => ({
      product_id: item.product_id._id,
      title: item.product_id.title,
      image: item.product_id.image,
      category: item.product_id.category_id.title, 
      price: item.product_id.price,
      quantity: item.quantity,

    }));
    
    console.log('orderItems:', orderItems);
    
    const cartItemIds = cartItems.map(item => item._id);
    const indexes = await collectionorder.listIndexes();
    const indexExists = indexes.some(index => index.name === 'title_1');
    if (!indexExists) {
      await collectionorder.collection.createIndex({ title: 1 });
    }

    const order = new collectionorder({
      customers_id: customerId,
      address_id: addressId,
      cart_id: cartItemIds ,
      total: total,
      payment_method: paymentMethod,
      order_items: orderItems 
    });

    await order.save();
    await collectioncart.deleteMany({ _id: { $in: cartItemIds  } });
    
    console.log('addressId:', addressId);
    if (paymentMethod === 'onlinepayment') {

      if (!addressId) { // check if the address is selected
        req.flash('error1', 'Please select the address');
        return res.redirect('/checkout');
      }

      const razorpayOptions = {
        amount: total * 100, 
        currency: 'INR',
        receipt: `order_${order._id}`,
        payment_capture: 1
      };
      const razorpayOrder = await instance.orders.create(razorpayOptions);

      
      var options = {
        "key": process.env.RAZORPAY_KEY_ID, 
        "amount": razorpayOptions.amount,
        "currency": razorpayOptions.currency,
        "name": "Your Company Name",
        "description": "Order Payment",
        "image": "https://your-company-logo.png",
        "order_id": razorpayOrder.id,
        "handler": function (response) {
       
          console.log(response);
          
         res.redirect('/account');
        },
       
        "theme": {
          "color": "#F37254"
        }
      };

      var rzp = new Razorpay(options);
      rzp.open();

    } else {
      req.flash('success', 'Order placed successfully!');
      res.redirect('/account');
    }
  } catch (err) {
    console.log(err);
    req.flash('error1', 'Please select the address');
    res.redirect('back');
  }
}



module.exports = {

    cart,
    postCart,
    deleteCart,
    checkout,
    address,
    placeOrder,
    deleteaddress,
    updateCart 
    
    

}