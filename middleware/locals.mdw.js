import productController from '../controllers/product.controller.js'
import CategoryModel from '../models/category.model.js'
import ProductModel from '../models/product.model.js'
import User from '../models/user.model.js'

export default (app) => {
    app.use(async function (req, res, next) {
        if (req.session.passport)
            res.locals.user = await User.findById(req.session.passport.user);
        res.locals.auth = req.isAuthenticated();
        next();
    });


}