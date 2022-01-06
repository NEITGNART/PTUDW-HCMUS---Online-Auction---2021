import ProductModel from '../models/product.model.js';
import CategoryModel from '../models/category.model.js';
import UserModel from '../models/user.model.js';
import moment from 'moment';

function maskInfo(value) {
    // mask with middle part with *
    if (value.length < 4) {
        // return replace with *
        return value.replace(/./g, '*');
    } else {
        // return replace with middle part with *
        return value.replace(/./g, '*').substring(0, value.length - 4) + value.substring(value.length - 4, value.length);
    }
};


function isExpired(date) {
    return moment(date).diff(moment());
};

function extendExpire(date) {
    return moment(date).add(10, 'minutes');
};


const productController = {

    detail: async (req, res) => {

        const productId = req.query.id;
        // find product by id

        const product = await ProductModel.findById(productId).lean();

        if (!product) {
            res.render('404');
            return;
        }

        const user = await UserModel.findById(product.seller).lean();
        product.sellDate = moment(product.sellDate).format('HH:MM DD/MM/YYYY');
        product.expDate = moment(product.expDate).format("YYYY-MM-DD HH:MM:SS");
        product.expDate = "" + moment(product.expDate).valueOf();




        let highestBidder = undefined;

        if (product.historyBidId.length > 0) {
            const lastProduct = product.historyBidId[product.historyBidId.length - 1];
            highestBidder= await UserModel.findById(lastProduct.username).lean();
            console.log(highestBidder);
            product.highestBidder = maskInfo(highestBidder.profile.name);
            product.highestBidderPoint = lastProduct.point;
        }

        for (let i = 0; i < product.historyBidId.length; i++) {
            const bid = product.historyBidId[i];
            const bidder = await UserModel.findById(bid.username).lean();
            product.historyBidId[i].username = maskInfo(bidder.profile.name);
            product.historyBidId[i].bidDate = moment(bid.bidDate).format('HH:MM DD/MM/YYYY');
        }

        // const obj = {
        //     // name, id product, and date
        //     bidDate: Date.now(),
        //     username: "61c0951bc0a54110f047dc16",
        //     price: 2000000
        // }
        //
        // product.historyBidId.push(obj);
        // // save product
        // await ProductModel.findByIdAndUpdate(productId, product);



        res.render('detailProduct', {
            product,
            user,
        });
    },

    index: async (req, res) => {
        const maincategory = req.query.maincategory;
        const search = req.query.search || "";
        const sort = req.query.sort;
        const subcategory = req.query.category || "";
        let maxItems = +req.query.limit || 12;
        let currentPage = +req.query.page || 1;
        let skipItem = (currentPage - 1) * maxItems;
        skipItem = +skipItem;
        currentPage = +currentPage;

        let stringQuery = req.query;
        delete stringQuery.page;


        var products;
        var totalItems;

        // find all product and update the expire date
        await ProductModel.find({}).then(async (data) => {
            for (let i = 0; i < data.length; i++) {
                if (isExpired(data[i].expire) < 0) {
                    data[i].expire = extendExpire(data[i].expire);
                    await data[i].save();
                }
            }
        });


        if (subcategory === "") {

            // random product
            totalItems = await ProductModel.countDocuments({
                status: "bidding",
            });

            const sortProduct = {
                // if sort is sellDate, descending
                $sort: {
                    [sort]: 1
                }
            }
            if (sort === "expDate") {
                sortProduct.$sort[sort] = -1;
            }

            var pipeline = [{
                $match: {
                    $text: {
                        $search: search
                    }
                }
            }, {
                $match: {
                    status: "bidding",
                }
            }, sortProduct, {
                $skip: skipItem
            }, {
                $limit: maxItems
            }]

            if (search === "") {
                // remove the first element
                pipeline.shift();
            }

            products = await ProductModel.aggregate(pipeline);
        } else {

            // calculate total items in document

            totalItems = await ProductModel.countDocuments({
                category: subcategory,
                status: "bidding",
            });

            const pipeline = [{
                $match: {
                    $text: {
                        $search: search
                    }
                }
            }, {
                $match: {
                    category: subcategory,
                    status: "bidding",
                }
            }, {
                $sort: {
                    [sort]: 1
                }
            }, {
                $skip: skipItem
            }, {
                $limit: maxItems
            }];
            if (search === "") {
                pipeline.shift();
                // remove last element
            } else {
                pipeline.pop();
            }
            products = await ProductModel.aggregate(pipeline);
        }

        console.log("Total" + totalItems);

        const cats = await CategoryModel.find().lean();

        if (search !== "") {
            totalItems = products.length;
        }

        let maxPage = parseInt(((totalItems) / (maxItems)) + 1);

        if (totalItems % maxItems === 0) {
            maxPage = maxPage - 1;
        }

        if (currentPage > maxPage) {
            currentPage = maxPage;
        }

        const error = products.length === 0;

        let category = [];
        // get all name of cats model
        cats.forEach(cat => {
            category.push(cat.name);
        });


        for (let i = 0; i < products.length; i++) {

            products[i].expDate = moment(products[i].expDate).format("YYYY-MM-DD HH:MM:SS");
            products[i].expDate = "" + moment(products[i].expDate).valueOf();
            products[i].sellDate = moment(products[i].sellDate).format("HH:MM-DD/MM/YYYY");
            products[i].currentWinner = undefined;
            products[i].numberBidders = products[i].historyBidId.length;
            if (products[i].historyBidId.length > 0) {
                const lastBid = products[i].historyBidId[products[i].historyBidId.length - 1];
                const user = await UserModel.findById(lastBid);
                if (user) {
                    products[i].currentWinner = maskInfo(user.profile.name);
                }
            }
        }

        let username = undefined;
        let id = undefined;
        if (res.locals.user) {
            username = res.locals.user.profile.name;
            id = res.locals.user.id;
            const myMap = new Map();
            for (const wish of res.locals.user.wishlist) {
                myMap.set(wish, wish);
            }
            for (let i = 0; i < products.length; i++) {
                products[i].isWishlist = '' + products[i]._id === '' + myMap.get(products[i]._id + "");
            }
        }
        // wait for all async function to finish
        await Promise.all(products).then(() => {
            res.render('product', {
                products,
                category,
                subcategory,
                currentPage,
                stringQuery,
                maxPage,
                maxItems,
                sort,
                totalItems,
                search,
                error,
                maincategory,
                username,
                idUser: id,
            })
        });


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