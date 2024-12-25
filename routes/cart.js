var express = require('express');
var router = express.Router();

cartController = require('../controller/cartController')
const authUser = require('../middleware/auth')

router.get('/', authUser.isLogin,  cartController.cart)
router.post('/', cartController.postCart)
router.post('/:cartItemId/quantity', cartController.updateCart)
router.get('/delete/:id', cartController.deleteCart)



module.exports = router;