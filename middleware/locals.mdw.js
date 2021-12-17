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

    app.use(async (req, res, next) => {

        const products = await ProductModel.find({ status: "bidding" });
        // update product

        products.forEach(async (product) => {

            var doc = await ProductModel.findOne({ _id: product._id });
            if (doc.extend === 'yes' && productController.isExpired(product.expDate) <= 5 * 60 * 1000) {
                doc.extend = 'no';
                doc.expDate = productController.extendExpire(product.expDate);
            }
            if (productController.isExpired(product.expDate) <= 0) {
                doc.status = 'done';
                // Update category
                try {
                    const cat = await CategoryModel.findOne({ subCate: { $in: doc.category[0] } });
                    // await cat.save();
                }
                catch {
                    console.log("Error");
                }
                // await doc.save();
            }
        })

        const cats = await CategoryModel.find();
        res.locals.cats = cats;
        res.locals.products = products;
        next();
    });


}