    const path = require('path');
    const express = require('express');
    const shopController = require('../controllers/shop');
    
    const router = express.Router();
    
    router.get('/', shopController.getIndex);
    router.get('/products',shopController.getProducts);
  //   // // router.get('/products/delete'); //spicific routes before dynamic segment
  //   // //products/37474783(any random no)
  //   // //: indicates a variable (dynamic) segment to express
   router.get('/products/:productId',shopController.getProduct);
  //    router.get('/cart', shopController.getCart);
     router.post('/cart', shopController.postCart);
  //    router.post('/cart-delete-item', shopController.postDeleteCart);
  //    router.post('/create-order', shopController.postOrder);
  //    router.get('/orders', shopController.getOrder);
  //   // router.get('/checkout', shopController.getChekout);

    
module.exports = router;
    