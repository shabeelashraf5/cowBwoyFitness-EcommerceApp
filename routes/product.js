var express = require('express');
var router = express.Router();
const authUser = require('../middleware/auth')

const productController = require('../controller/productController')

router.get('/',  productController.allProduct)
router.get('/shop-men',  productController.menProduct)
router.get('/shop-women',  productController.womenProduct)
router.get('/wishlist', authUser.isLogin,  productController.wishlist)
router.get('/:id',  productController.productSingle)
router.get('/wishlist/delete/:id',authUser.isLogin, productController.deleteWishlist)
router.post('/wishlist',   productController.postWishlist )



















module.exports = router;