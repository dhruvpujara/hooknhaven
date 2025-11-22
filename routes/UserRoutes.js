const Router = require('express').Router();
const ussercontroller = require('../controller/UsserController');


// get method

Router.get('/', ussercontroller.getindex);
Router.get('/products', ussercontroller.getproducts);
Router.get('/product/:collection/:item', ussercontroller.getproductdetails);
Router.get('/OrderConfirmed', ussercontroller.getorderconfirmed);

// Route for buying a specific product (shows buy/checkout page)
Router.get('/buy/:_id', ussercontroller.buyProduct);
Router.post('/Confirm-purchase', ussercontroller.addPurchase);
module.exports = Router;