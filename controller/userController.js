var express = require('express');
const collection = require('../model/userD')
const collectionbanner = require('../model/bannerD')
const sentEmail = require('../auth/sentEmail')
const randomstring = require('randomstring')
const { token } = require('morgan');
const otpsentEmail = require('../auth/otpsentMail')
const TimerSet = require('../auth/startTimer')
const collectionorder = require('../model/orderD')
const collectionwishlist = require('../model/wishlistD')
const collectionproduct = require('../model/productsD')



const eHome = async function(req, res) {
  
  try {
    const docs = await collectionbanner.find({});
    const banner = docs[0].image; 
    const docsp = await collectionproduct
      .find({}).populate('category_id', 'title').limit(8)
    res.render('e-compage', { loggedIn: req.session.customerId, banner: banner, productDisplay: docsp });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
} 


const loadLogin = function(req,res){

   
    res.render('loginpage')
 

}

/* const loadLoginuser = async function(req, res) {
    try {
      const check = await collection.findOne({ email: req.body.email });
      if (
        check.password === req.body.password &&
        check.blocked === false ||
        check.fname === req.body.fname
      ) {
        
        req.session.customerId = check._id
        console.log(req.body);
        console.log(req.session);
        res.redirect("/home");
      } else if (check.blocked === true) {
        console.log("User is blocked");
        res.render("loginpage", { errmessage1: "Your account has been blocked" });
      } else {
        console.log("Incorrect Password");
        res.render("loginpage", { errpass: "Incorrect Password" });
      }
    } catch (error) {
      console.log(error.message)
      res.render("loginpage", { errmessage: "Enter your Email and Password" });
    }
  }; */


  const loadLoginuser = async function(req, res) {
    try {
        const check = await collection.findOne({ email: req.body.email });
        if (check.signup_completed === false) {
            res.render("loginpage", { errmessage3: "Please complete your sign up process" });
        } else if (check.password === req.body.password && check.blocked === false || check.fname === req.body.fname) {
            req.session.customerId = check._id;
            console.log(req.body);
            console.log(req.session);
            res.redirect("/home");
        } else if (check.blocked === true) {
            console.log("User is blocked");
            res.render("loginpage", { errmessage1: "Your account has been blocked" });
        } else {
            console.log("Incorrect Password");
            res.render("loginpage", { errpass: "Incorrect Password" });
        }
    } catch (error) {
        console.log(error.message);
        res.render("loginpage", { errmessage: "Enter your Email and Password" });
    }
};

  



const signUp = function(req,res){
    res.render('signuppage') 
}


    const signUpuser = async function(req, res){
    const otp = Math.floor(100000 + Math.random() * 900000);
    const data = {
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        password: req.body.password,
        otp: otp,
        signup_completed: false
        
    };
    try {
        
        await collection.insertMany([data]);
        otpsentEmail.otpsentMail(data.fname, data.email, otp);
        res.render('otpverificationpage', { email: data.email, otp: data.otp });
    } catch (error) {
        if (error.code === 11000) {
            res.render('signuppage', { error1: 'Email ID already exists', data: req.body });
        } else if (data.fname == "" || data.lname == "" || data.email == "" || data.password == "") {
            res.render('signuppage', { error: 'Enter Full Details', data: req.body });
        } else if (error.errors && error.errors.otp) {
            res.render('signuppage', { error: 'Enter OTP', data: req.body });
        } else {
            console.log(error);
            res.render('signuppage', { error: 'Error in Sign Up', data: req.body });
        }
    }
}


 const resendOtp = async function(req,res){

  const email = req.body.email;
  const newOTP = Math.floor(100000 + Math.random() * 900000);
  try {
    const result = await collection.findOneAndUpdate(
      { email: email },
      { $set: { otp: newOTP } },
      { returnOriginal: false }
    );
    if (result) {
      otpsentEmail.otpsentMail(result.fname, result.email, newOTP);
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }

} 


   /* const verifyOTP = async function(req, res) {
    const email = req.body.email;
    const otp = req.body.otp;
    const original_otp = req.body.original_otp;

    console.log('Email:', email, 'OTP:', otp);
  
    try {
      const result = await collection.findOneAndUpdate(
        { email: email, otp: original_otp },
        { $set: { otp: '' } },
        { returnOriginal: false }
      );
  
      if (result) {
        
        res.render('signuppage',{registration: 'Registration Completed'});
      } else  {
        res.render('otpverificationpage', { email: email, error: 'Invalid OTP' });
      }
    } catch (error) {
      console.log(error);
      res.render('otpverificationpage', { email: email, error: 'Server Error' });
    }
  };  */

  const verifyOTP = async function(req, res) {
    const email = req.body.email;
    const otp = req.body.otp;
    const original_otp = req.body.original_otp;

    console.log('Email:', email, 'OTP:', otp);

    if (!otp) {
        return res.render('otpverificationpage', { email: email, error1: 'Please enter OTP' });
    }

    try {
        const result = await collection.findOneAndUpdate(
            { email: email, otp: original_otp },
            { $set: { otp: '', signup_completed: true } },
            { returnOriginal: false }
        );

        if (result) {
            // The user has successfully completed the sign-up process, and their data is updated in the database
            res.render('signuppage',{registration: 'Registration Completed'});
        } else {
            res.render('otpverificationpage', { email: email, error: 'Invalid OTP' });
        }
    } catch (error) {
        console.log(error);
        res.render('otpverificationpage', { email: email, error: 'Server Error' });
    }
};

  
  
  
 
const logoutUser = async function (req,res){

   try{

    req.session.destroy()

    res.redirect('/login')

   } catch (error){

    console.log(error.message)
   }
}




const passRecover = function (req,res){

    res.render('resetpass')
}




  const OtpSent = async function (req,res){


    try {
      
      const otp = Math.floor(100000 + Math.random() * 900000)
      const userDetails1 = await collection.findOne({email: req.body.email})

      if(userDetails1){
        
        otpsentEmail.otpsentMail(data.fname, data.email, otp);
        res.render('otpverificationpage', { email: data.email, otp: data.otp });
    
}else{

  

}
  

}catch{

  console.log('Error Occured')
}
    


  }

  
    const resetPassword = async function(req,res){

    try {

        const userDetails = await collection.findOne({email: req.body.email})

        if(userDetails){
            
            const randomString = randomstring.generate()
            await collection.updateOne({email: req.body.email}, {$set:{token: randomString }})
            sentEmail.sentMail(userDetails.fname, userDetails.email, randomString)
            res.render('loginpage', {succmessage2: 'WE HAVE SENT YOU AN EMAIL WITH A LINK' })
            console.log('Successfull')
      
}else{

    res.render('resetpass', {errmessage2:'Email ID is Incorrect'})
    console.log('Error')

}
    

}catch{

    console.log('Error Occured')
}


} 


const passReset = async function (req,res){

    try{
        
         const token = req.query.token
         const tokenData = await collection.findOne({token:token})

         if(tokenData){
            res.render('updatepass', {user_id:tokenData._id, data:tokenData})
         }
         

    }catch(error){
        
         console.log(error.message)

    }

   
}


const resetSuccess = async function(req,res){

    try{
        
        const user_id = req.body.user_id 
        
       const passDetails = await collection.findByIdAndUpdate({_id: user_id}, {$set:{password:req.body.password, token:''}})

        res.render('loginpage', {message2: 'Your password has been updated'})
        console.log('Update Success')
        
    }catch(error){

        console.log(error.message)
    }
}


const userOrder = async function(req,res){
  try{
  const customerId = req.session.customerId;
  const orders =   await collectionorder.find({customers_id: customerId}).sort({createdAt: -1}).populate('order_items.product_id');
  const customer = await collection.findOne({ _id: customerId });
  
        res.render('userAccount', {orderDetails: orders, customerDetails: customer,flash: req.flash() , loggedIn: req.session.customerId});

  }catch(err){
    console.log(err)
  }
   
};


const userOrderdetails = async function(req, res) {
  
  const orderId = req.params.id;
  const orderDetails = await collectionorder.findById(orderId).populate('cart_id.order_items.product_id');

  res.render('userAccount-details', {
      loggedIn: req.session.customerId,
      orderItems: orderDetails.order_items.map(item => ({
      image: item.image[0],
      productName: item.title,
      unitPrice: item.price,
      quantity: item.quantity,
      category: item.category,
    }))
  });
};

const cancelOrder = async function(req, res) {
  const orderId = req.params.orderId;
  try {
    const order = await collectionorder.findById(orderId);
    if (!order) {
      return res.status(404).send('Order not found');
    }

    
    const cancelledOrderAmount = order.total;
    order.total -= cancelledOrderAmount;

    
    order.status = 'Order Cancelled';

    await order.save();
    res.redirect('/account');
  } catch (err) {
    console.log(err);
    next(err);
  }
}


  const postWishlist = async function(req, res) {
  try {
    const wishlist = new collectionwishlist({
      customers_id: req.session.customerId,
      product_id: req.body.product_id
    });
    await wishlist.save();
    res.send('Product added to wishlist successfully.');
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error');
  }
};


const wishlist = async function(req, res) {
  try {
    const customerId = req.session.customerId;
    const wishlistDetails = await collectionwishlist
      .find({ customers_id: customerId })
      .populate('product_id');
    res.render('wishlist', {
      wishlistDetails: wishlistDetails,
      loggedIn: req.session.customerId
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error');
  }
};

const deleteWishlist = function(req,res){

  const wishlistId = req.params.id;

  collectionwishlist.findByIdAndRemove(wishlistId, (err, deletedwishlist) => {
    if (err) {
      console.log('Error Occured', err);
      res.status(500).send('Error Occured');
    } else {
      console.log('Wishlist deleted:', deletedwishlist);
      res.redirect('/wishlist');
    }
  });

} 

const successOrder = function(req,res){

  res.render('success', {loggedIn: req.session.customerId})
}








module.exports = {
    loadLogin,
    eHome,
    signUp,     
    signUpuser,
    loadLoginuser,
    passRecover,
    logoutUser ,
    resetPassword,
    passReset, 
    resetSuccess,
    verifyOTP,
    resendOtp,
    userOrder,
    postWishlist,
    wishlist,
    deleteWishlist, 
    userOrderdetails,
    cancelOrder,
    successOrder,
    
  
}
