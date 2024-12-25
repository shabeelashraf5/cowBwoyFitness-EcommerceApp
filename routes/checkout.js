var express = require('express');
var router = express.Router();

cartController = require('../controller/cartController')
const authUser = require('../middleware/auth')


router.get('/', authUser.isLogin , cartController.checkout)
router.post('/address', cartController.address)
// router.get('/payment', authUser.isLogin, cartController.payment)
router.post('/order', cartController.placeOrder)
router.get('/address/delete/:id', cartController.deleteaddress)


router.get('/wishlist' , function(req,res){


    res.render('wishlist')
})














module.exports = router;