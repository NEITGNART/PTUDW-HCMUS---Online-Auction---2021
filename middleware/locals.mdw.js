import productController from '../controllers/product.controller.js'
import CategoryModel from '../models/category.model.js'
import ProductModel from '../models/product.model.js'

export default (app) => {
    app.use(async function (req, res, next) {
        try {
            if (typeof (req.session.auth) === 'undefined') {
                req.session.auth = false;
                req.session.user = null;
            }
            res.locals.user = req.session.user;
            res.locals.auth = req.session.auth;
        } catch (err) {

        }
        next();
    });


}