const Router = require('express').Router();
const adminController = require('../controller/adminController');

// get method

Router.get('/admin/addProduct', adminController.getaddProduct);
Router.get('/admin/find-Update', adminController.getupdateProduct);
Router.get('/orderPanel', adminController.getorderPanel);


// post method

Router.post('/admin/add-column', adminController.createCrochetCollection);
Router.post('/admin/update-product', adminController.postupdateProduct);
Router.post('/completed', adminController.orderCompleted)




module.exports = Router;