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

        const search = req.query.search || "";
        const sort = req.query.sort;
        const category = req.query.category || "";
        let maxItems = +req.query.limit || 12;
        let currentPage = +req.query.page || 1;
        let skipItem = (currentPage - 1) * maxItems;
        skipItem = +skipItem;
        currentPage = +currentPage;

        let stringQuery = req.query;
        delete stringQuery.page;


        var products;
        var totalItems;

        if (category === "") {

            // random product
            totalItems = await ProductModel.countDocuments();

            const sortProduct =
                {
                    // if sort is sellDate, descending
                    $sort: {
                        [sort]: 1
                    }
                }
            if (sort === "expDate") {
                sortProduct.$sort[sort] = -1;
            }


            let searchQuery;

            if (search !== "") {
                searchQuery = {
                    $match: {
                        $text: {
                            $search: search
                        }
                    }
                };
            } else {
                // not include search
                searchQuery = {};
            }


            products = await ProductModel.aggregate([
                // full text search
                searchQuery,
                {
                    $match: {
                        status: "bidding",
                    }
                },
                sortProduct,

                {
                    $skip: skipItem
                },
                {
                    $limit: maxItems
                }

            ]);
        } else {
            // calculate total items in document

            totalItems = await ProductModel.countDocuments({
                category: category
            });

            products = await ProductModel.aggregate([
                searchQuery,
                {
                    $match: {
                        category: category,
                        status: "bidding",
                    }
                },
                {
                    $sort: {
                        [sort]: 1
                    }
                },
                {
                    $skip: skipItem
                },
                {
                    $limit: maxItems
                }
            ]);
        }

        console.log("Total" + totalItems);

        const cats = await CategoryModel.find().lean();

        let maxPage = parseInt(((totalItems) / (maxItems)) + 1);

        if (totalItems % maxItems === 0) {
            maxPage = maxPage - 1;
        }

        if (currentPage > maxPage) {
            currentPage = maxPage;
        }


        res.render('product', {
            products,
            category,
            currentPage,
            stringQuery,
            maxPage,
            maxItems,
            sort
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