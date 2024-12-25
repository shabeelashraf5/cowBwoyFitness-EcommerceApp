var express = require('express');
var router = express.Router();

const adminController = require('../controller/adminController')
const upload = require('../fileUpload/upload')
const authadmin = require('../middleware/authadmin')

router.get('/',authadmin.isLogout, adminController.adminLogin)
router.post('/home', adminController.loadLoginadmin )
router.get('/home', authadmin.isLogin, adminController.adminHome )
router.get('/dashboard',authadmin.isLogin, adminController.adminDashboard)
router.get('/customer',authadmin.isLogin, adminController.adminCustomer)
router.get('/customer/create',authadmin.isLogin, adminController.createCustomer)
router.post('/customer/create', adminController.customerDetails)
router.get('/customer/update/:id', authadmin.isLogin, adminController.editCustomer)
router.post('/customer/update/:id', adminController.updateCustomer)
router.get('/customer/delete/:id', adminController.deleteCustomer)
router.get('/adminUser', authadmin.isLogin, adminController.adminUser)
router.get('/adminUser/create',authadmin.isLogin, adminController.createadmin)
router.post('/adminUser/create', adminController.adminDetails)
router.get('/adminUser/update/:id',authadmin.isLogin, adminController.editadmin)
router.post('/adminUser/update/:id', adminController.updateadmin)
router.get('/adminUser/delete/:id', adminController.deleteadmin)
router.get('/product',authadmin.isLogin,  adminController.adminProduct)
router.get('/product/create',authadmin.isLogin,  adminController.createproduct)
router.post('/product/create', upload.array('image[]', 3) ,adminController.productDetails)
router.get('/product/update/:id',authadmin.isLogin, adminController.editproduct)
router.post('/product/update/:id',upload.array('image[]', 3), adminController.updateproduct)
router.get('/product/delete/:id', adminController.deleteproduct)
router.post('/product/:id/active', adminController.activeProduct)
router.post('/customer/:id/block', adminController.blockUser)
router.get('/category',authadmin.isLogin,  adminController.adminCategory)
router.get('/category/create', authadmin.isLogin,  adminController.createcategory)
router.post('/category/create',  adminController.categoryDetails)
router.get('/category/update/:id',authadmin.isLogin, adminController.editCategory)
router.post('/category/update/:id', adminController.updateCategory)
router.get('/category/delete/:id', adminController.deletecategory)
router.post('/category/:id/active', adminController.activeCategory)
router.get('/image/delete/:id/:imageId', adminController.deleteimage);
router.get('/logout', authadmin.isLogout, adminController.logoutadmin)
router.get('/coupon',authadmin.isLogin,  adminController.adminCoupon)
router.get('/coupon/create', authadmin.isLogin,  adminController.createcoupon)
router.post('/coupon/create',  adminController.couponDetails)
router.get('/coupon/update/:id',authadmin.isLogin, adminController.editCoupon)
router.post('/coupon/update/:id', adminController.updateCoupon)
router.get('/coupon/delete/:id', adminController.deletecoupon)
router.get('/order',authadmin.isLogin,  adminController.adminOrder)
router.get('/order-action/:id',authadmin.isLogin, adminController.adminOrder2)
router.get('/banner',authadmin.isLogin,  adminController.adminBanner)
router.get('/banner/create',authadmin.isLogin,  adminController.createBanner)
router.post('/banner/create',  upload.array('image[]', 5) ,adminController.bannerDetails)
router.get('/banner/update/:id',authadmin.isLogin, adminController.editbanner)
router.post('/banner/update/:id',upload.array('image[]', 5), adminController.updateproduct)
router.get('/banner/image/delete/:id/:imageId', adminController.deleteimagebanner);
router.get('/banner/delete/:id', adminController.deletebanner)
router.get('/report',authadmin.isLogin,  adminController.adminReport)
router.post('/download/excel', adminController.downloadexcel)
router.post('/download/pdf', adminController.downloadPdf)



module.exports = router;