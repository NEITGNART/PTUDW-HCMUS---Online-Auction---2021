import ProductModel from '../models/product.model.js';
import CategoryModel from '../models/category.model.js';


import moment from 'moment'

function maskInfo(value) {
    let maskedValue = value;
    if (value && value.length > 5) {
        maskedValue =
            "***" + maskedValue.substring(value.length - 4, value.length);
    } else {
        maskedValue = "****";
    }
    return maskedValue;
};

function isExpired(date) {
    return moment(date).diff(moment());
};

function extendExpire(date) {
    return moment(date).add(10, 'minutes');
};




const productController = {



    sortProductByTime: async (req, res) => {
        const maxItems = 12;
        const currentPage = req.query.page || 1;
        let skipItem = (currentPage - 1) * maxItems;
        const maxPage = (ProductModel.countDocuments() / maxItems) + 1;

        const products = await ProductModel.find({
            status: "bidding"
        }).skip(skipItem).limit(maxItems).sort({ expDate: -1 }).lean();

        // update product
        products.forEach(async (product) => {

            var doc = await ProductModel.findOne({
                _id: product._id
            });

            if (doc.extend === 'yes' && isExpired(product.expDate) <= 5 * 60 * 1000) {
                doc.extend = 'no';
                doc.expDate = extendExpire(product.expDate);
            }


            if (isExpired(product.expDate) <= 0) {
                doc.status = 'done';
                // Update category
                try {
                    const cat = await CategoryModel.findOne({
                        subCate: {
                            $in: doc.category[0]
                        }
                    });
                    // await cat.save();
                } catch {
                    console.log("Error");
                }
                // await doc.save();
            }
        })

        const cats = await CategoryModel.find().lean();

        res.render('product', {
            products,
            cats,
            currentPage,
            maxPage
        })




    },

    sortProductByPrice: async (req, res) => {
        const maxItems = 12;
        const currentPage = req.query.page || 1;
        let skipItem = (currentPage - 1) * maxItems;
        const maxPage = (ProductModel.countDocuments() / maxItems) + 1;

        const products = await ProductModel.find({
            status: "bidding"
        }).skip(skipItem).limit(maxItems).sort({ currentPrice: 1 }).lean();

        // update product
        products.forEach(async (product) => {

            var doc = await ProductModel.findOne({
                _id: product._id
            });

            if (doc.extend === 'yes' && isExpired(product.expDate) <= 5 * 60 * 1000) {
                doc.extend = 'no';
                doc.expDate = extendExpire(product.expDate);
            }


            if (isExpired(product.expDate) <= 0) {
                doc.status = 'done';
                // Update category
                try {
                    const cat = await CategoryModel.findOne({
                        subCate: {
                            $in: doc.category[0]
                        }
                    });
                    // await cat.save();
                } catch {
                    console.log("Error");
                }
                // await doc.save();
            }
        })

        const cats = await CategoryModel.find().lean();

        res.render('product', {
            products,
            cats,
            currentPage,
            maxPage
        })




    },

    listProduct: async (req, res) => {


        const maxItems = 12;
        const currentPage = req.query.page || 1;
        let skipItem = (currentPage - 1) * maxItems;
        const maxPage = (ProductModel.countDocuments() / maxItems) + 1;


        const products = await ProductModel.find({
            status: "bidding"
        }).skip(skipItem).limit(maxItems).lean();
        // update product
        products.forEach(async (product) => {

            var doc = await ProductModel.findOne({
                _id: product._id
            });

            if (doc.extend === 'yes' && isExpired(product.expDate) <= 5 * 60 * 1000) {
                doc.extend = 'no';
                doc.expDate = extendExpire(product.expDate);
            }


            if (isExpired(product.expDate) <= 0) {
                doc.status = 'done';
                // Update category
                try {
                    const cat = await CategoryModel.findOne({
                        subCate: {
                            $in: doc.category[0]
                        }
                    });
                    // await cat.save();
                } catch {
                    console.log("Error");
                }
                // await doc.save();
            }
        })

        const cats = await CategoryModel.find().lean();


        res.render('product', {
            products,
            cats,
            currentPage,
            maxPage
        })

    },
}


export default productController;