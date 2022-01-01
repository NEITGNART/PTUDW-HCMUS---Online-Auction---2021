import ProductModel from '../models/product.model.js';
import CategoryModel from '../models/category.model.js';
import moment from 'moment';

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


    index: async (req, res) => {

        const sort = req.query.sort;
        const category = req.query.category || "";
        let maxItems = +req.query.limit || 12;
        let currentPage = +req.query.page || 1;
        let skipItem = (currentPage - 1) * maxItems || 0;
        skipItem = +skipItem;
        console.log(skipItem);
        currentPage = +currentPage;

        let stringQuery = req.query;
        delete stringQuery.page;


        var products;
        var totalItems;

        if (category === "") {

            // random product
            totalItems = await ProductModel.countDocuments();

            products = await ProductModel.aggregate([
                {
                    $sample: {
                        size: maxItems
                    }
                },
                {
                    $sort: {
                        [sort]: 1
                    }
                },

                {
                    $limit: maxItems
                },
                {
                    $match: {
                        status: "bidding",
                    }
                },

            ]);
        } else {
            // calculate total items in document

            totalItems = await ProductModel.countDocuments({
                category: category
            });

            products = await ProductModel.aggregate([
                {
                    $match: {
                        category: category,
                        status: "bidding",
                    }
                },
                {
                    $sample: {
                        size: maxItems
                    }
                },
                {
                    $sort: {
                        [sort]: 1
                    }
                },
                {
                    $limit: maxItems
                }
            ]);
        }


        const cats = await CategoryModel.find().lean();

        const maxPage = parseInt(((totalItems) / (maxItems)) + 1);
        if (currentPage > maxPage) {
            res.render('404', {
                layout: false
            });
            return;
        }

        console.log(stringQuery)

        res.render('product', {
            products,
            cats,
            currentPage,
            stringQuery,
            maxPage
        })

    },
    pagination(c, m) {
        var current = c,
            last = m,
            delta = 2,
            left = current - delta,
            right = current + delta + 1,
            range = [],
            rangeWithDots = [],
            l;

        for (let i = 1; i <= last; i++) {
            if (i === 1 || i === last || i >= left && i < right) {
                range.push(i);
            }
        }

        for (let i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        }

        return rangeWithDots;
    }


}


export default productController;