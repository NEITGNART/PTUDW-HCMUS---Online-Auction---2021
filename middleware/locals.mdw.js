import productController from '../controllers/product.controller.js'
import CategoryModel from '../models/category.model.js'
import ProductModel from '../models/product.model.js'

export default (app) => {
    app.use(async function (req, res, next) {
        res.locals.user = req.session.user;
        res.locals.auth = req.isAuthenticated();
        next();
    });


}