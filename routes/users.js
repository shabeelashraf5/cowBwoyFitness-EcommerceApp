var express = require('express');
var router = express.Router();
const userController = require('../controller/userController')
const authUser = require('../middleware/auth')

/* GET users listing. */

router.get('/', authUser.isLogout, userController.eHome)
router.get('/home', authUser.isLogin, userController.eHome)
router.get('/login',authUser.isLogout, userController.loadLogin);
router.post('/home', userController.loadLoginuser)
router.get('/signup',authUser.isLogout, userController.signUp)
router.post('/signup', userController.signUpuser)
router.get('/logout', authUser.isLogin, userController.logoutUser)
router.get('/login-recover', authUser.isLogout, userController.passRecover)
router.post('/login-recover', userController.resetPassword)
router.get('/reset-password', authUser.isLogout, userController.passReset)
router.post('/reset-password', userController.resetSuccess)
router.post('/otpverification', userController.verifyOTP)
router.post('/resendotp', userController.resendOtp )
router.get('/account', authUser.isLogin,  userController.userOrder )
router.get('/account-productDetails/:id', authUser.isLogin, userController.userOrderdetails)
router.post('/cancel-order/:orderId',  userController.cancelOrder)
router.post('/wishlist',   userController.postWishlist )
router.get('/wishlist', authUser.isLogin,   userController.wishlist)
router.get('/wishlist/delete/:id', userController.deleteWishlist)
router.get('/success', authUser.isLogin,  userController.successOrder )






module.exports = router;
