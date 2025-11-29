const Router = require('express').Router();
const adminController = require('../controller/adminController');
const User = require('../model/userSchema')

// get method

const isAdmin = async (req, res, next) => {
    const isLoggedIn = req.session.isLoggedIn

    if (!isLoggedIn) {
        return res.redirect('/login')
    }

    const userId = req.session.id
    const user = User.findById(userId)

    const isAdmin = user.role === 'admin';
    if (!isAdmin) {
        res.redirect('/')
    }
}

Router.get('/admin/addProduct', isAdmin, adminController.getaddProduct);
Router.get('/admin/find-Update', isAdmin, adminController.getupdateProduct);
Router.get('/orderPanel', isAdmin, adminController.getorderPanel);


// post method

Router.post('/admin/add-column', adminController.createCrochetCollection);
Router.post('/admin/update-product', adminController.postupdateProduct);
Router.post('/completed', adminController.orderCompleted)




module.exports = Router;