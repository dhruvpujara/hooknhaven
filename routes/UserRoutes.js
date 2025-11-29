const Router = require('express').Router();
const ussercontroller = require('../controller/UsserController');
const { isAuth } = require('../middlewear/isAuth');


// get method

Router.get('/', ussercontroller.getindex);
Router.get('/products', ussercontroller.getproducts);
Router.get('/product/:collection/:item', ussercontroller.getproductdetails);
Router.get('/OrderConfirmed', ussercontroller.getorderconfirmed);
Router.get('/register', ussercontroller.getregister);
Router.get('/login', ussercontroller.getlogin);

// Route for buying a specific product (shows buy/checkout page)
Router.get('/buy/:_id', ussercontroller.buyProduct);
Router.post('/Confirm-purchase', ussercontroller.addPurchase);
Router.post('/register', ussercontroller.registerUser);
Router.post('/login', ussercontroller.loginUser);
module.exports = Router;