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

function validLimit(maxItems) {
    return !(maxItems !== 12 && maxItems !== 9 && maxItems !== 6);

};


function isExpired(date) {
    return moment(date).diff(moment());
};

function extendExpire(date) {
    return moment(date).add(10, 'minutes');
};

async function updateExpired() {

    const updateProduct = await ProductModel.find({
        status: 'bidding',
        expDate: {
            $lt: new Date()
        }
    });

    // update status of product to sold
    for (let i = 0; i < updateProduct.length; i++) {
        const product = updateProduct[i];
        product.status = 'expired';
        await product.save();
    }

}

const productController = {

    autoBidding: async (req, res) => {

        updateExpired();


        if (req.query.id && req.body.bid) {
            var user = await UserModel.findById(req.user._id);
            var product = await ProductModel.findById(req.query.id);
            var bidPrice = req.body.bid;
            var current = moment().format("YYYY/MM/DD HH:MM:SS");


            if (product.block.indexOf(JSON.stringify((user._id))) !== -1) {
                res.redirect(`/product/detail?id=${req.query.id}`);
            }


            if (hisBid.length.length === 0) {
                product.topBidder = JSON.stringify(user._id);
                product.historyBidId.push({
                    bidDate: current,
                    username: user._id,
                    price: bidPrice
                });
                user.currentBiddingList.push({
                    idProduct: product._id,
                    maxPrice: bidPrice
                });
                await product.save();
                await user.save();
                res.redirect(`/product/detail?id=${req.query.id}`);
            } else {
                var hisBid = product.historyBidId;

                var bestBidder = await UserModel.findById(hisBid[hisBid.length - 1].username);

                var maxPriceOfBestBidder = bestBidder.currentBiddingList.find(e => e.idProduct === product._id);
                var indexSplice = hisBid.findIndex(hb => hb.username === user._id);

                if (indexSplice === -1) {
                    user.currentBiddingList.push({
                        idProduct: product._id,
                        maxPrice: bidPrice
                    });
                } else {
                    var indexCurrentProId = user.currentBiddingList.findIndex(e => e.idProduct === product._id);
                    user.currentBiddingList[indexCurrentProId].maxPrice = bidPrice;
                }

                if (maxPriceOfBestBidder.maxPrice >= bidPrice) {
                    var best = hisBid[hisBid.length - 1];
                    best.bidDate = moment().format("YYYY/MM/DD HH:MM:SS");
                    if (bidPrice + product.stepPrice >= maxPriceOfBestBidder.maxPrice) {
                        product.current = maxPriceOfBestBidder.maxPrice;
                    } else {
                        product.current = bidPrice + product.stepPrice;
                    }
                    hisBid[hisBid.length - 1] = {
                        bidDate: current,
                        username: JSON.stringify((user._id)),
                        price: bidPrice
                    }
                    hisBid.push(best);
                } else {
                    if (maxPriceOfBestBidder.maxPrice + product.stepPrice >= bidPrice) {
                        product.current = bidPrice;
                    } else {
                        product.current = maxPriceOfBestBidder.maxPrice + product.stepPrice;
                    }
                    hisBid.push({
                        bidDate: current,
                        username: JSON.stringify((user._id)),
                        price: bidPrice
                    });
                }
                product.historyBidId = hisBid;
                await product.save();
            }


        } else {
            res.render('404', {
                layout: false
            });
        }

    },
    updateDescription: async (req, res) => {
        const productId = req.query.id;
        const updateDate = moment().format('DD/MM/YYYY');
        var newDes = req.body.description;


        const product = await ProductModel.findById(productId);
        if (product) {
            var oldDes = product.description;
            product.description = oldDes + `<hr><p>✏️ ${updateDate} </p>` + newDes;
            await product.save();
            res.redirect(req.originalUrl);

        } else {
            res.render('404', {
                layout: false
            });
        }
    },

    topEnding: async (req, res) => {
        // find 5 product with date nearest to now and status bidding
        const productRelative = await ProductModel.find({
            status: 'bidding',
            expDate: {
                $gt: new Date()
            }
        }).sort({
            expDate: 1
        }).limit(5).lean();

        for (let i = 0; i < productRelative.length; i++) {
            const productRelativeItem = productRelative[i];
            const user = await UserModel.findById(productRelativeItem.seller).lean();
            productRelativeItem.numberBidders = productRelativeItem.historyBidId.length;
            var diff = moment.duration(moment(productRelativeItem.sellDate).diff(moment())).asHours();
            productRelativeItem.isNew = (0 < Math.abs(diff)) && (Math.abs(diff) < 24);
            productRelativeItem.sellDate = moment(productRelativeItem.sellDate).format('HH:MM DD/MM/YYYY');
            productRelativeItem.expDate = moment(productRelativeItem.expDate).format("YYYY-MM-DD HH:MM:SS");
            productRelativeItem.expDate = "" + moment(productRelativeItem.expDate).valueOf();

            productRelativeItem.seller = maskInfo(user.profile.name);

            productRelativeItem.numberBidders = productRelativeItem.historyBidId.length;
            productRelativeItem.username = user.profile.name;
            // product image is the first element
            productRelativeItem.image = productRelativeItem.images[0];

        }


        return productRelative;
    },

    topBidding: async (req, res) => {

        updateExpired();
        // find all product with date expired and status bidding with date expired > now


        // get 5 product with status bidding and number element of historyBidId largest
        const productRelative = await ProductModel.find({
            status: 'bidding',
        }).sort({
            historyBidId: -1
        }).limit(5).lean();


        for (let i = 0; i < productRelative.length; i++) {
            const productRelativeItem = productRelative[i];
            const user = await UserModel.findById(productRelativeItem.seller).lean();
            productRelativeItem.numberBidders = productRelativeItem.historyBidId.length;
            var diff = moment.duration(moment(productRelativeItem.sellDate).diff(moment())).asHours();
            productRelativeItem.isNew = (0 < Math.abs(diff)) && (Math.abs(diff) < 24);
            productRelativeItem.sellDate = moment(productRelativeItem.sellDate).format('HH:MM DD/MM/YYYY');
            productRelativeItem.expDate = moment(productRelativeItem.expDate).format("YYYY-MM-DD HH:MM:SS");
            productRelativeItem.expDate = "" + moment(productRelativeItem.expDate).valueOf();

            productRelativeItem.seller = maskInfo(user.profile.name);

            productRelativeItem.numberBidders = productRelativeItem.historyBidId.length;
            productRelativeItem.username = user.profile.name;
            // product image is the first element
            productRelativeItem.image = productRelativeItem.images[0];

        }


        return productRelative;
    },

    topPricing: async (req, res) => {
        updateExpired();

        // find top 5 product with status bidding and heighest current price
        const productRelative = await ProductModel.find({
            status: 'bidding'
        }).sort({
            currentPrice: -1
        }).limit(5).lean();


        for (let i = 0; i < productRelative.length; i++) {
            const productRelativeItem = productRelative[i];
            const user = await UserModel.findById(productRelativeItem.seller).lean();
            productRelativeItem.numberBidders = productRelativeItem.historyBidId.length;
            var diff = moment.duration(moment(productRelativeItem.sellDate).diff(moment())).asHours();
            productRelativeItem.isNew = (0 < Math.abs(diff)) && (Math.abs(diff) < 24);
            productRelativeItem.sellDate = moment(productRelativeItem.sellDate).format('HH:MM DD/MM/YYYY');
            productRelativeItem.expDate = moment(productRelativeItem.expDate).format("YYYY-MM-DD HH:MM:SS");
            productRelativeItem.expDate = "" + moment(productRelativeItem.expDate).valueOf();

            productRelativeItem.seller = maskInfo(user.profile.name);

            productRelativeItem.numberBidders = productRelativeItem.historyBidId.length;
            productRelativeItem.username = user.profile.name;
            // product image is the first element
            productRelativeItem.image = productRelativeItem.images[0];

        }


        return productRelative;
    },
    blockUser: async (req, res) => {


        const idProduct = req.query.idProduct;
        const idUserBlock = req.query.idUserBlock;
        // find idUserBlock and idProduct
        let user;
        try {
            user = await UserModel.findById(idUserBlock);
        } catch (error) {
            return res.json({
                message: "Not found",
            });
        }
        const product = await ProductModel.findById(idProduct);
        // check that myself is owner of product

        if (res.locals.userLocal && product && (product.seller.toString() !== res.locals.userLocal._id.toString())) {
            // wait promise product

            return res.json({
                message: 'Owner'
            });
        }
        if (user && product) {

            if (product.block.length === 0) {
                product.block.push(idUserBlock);
                await product.save();
                return res.json({
                    message: 'success'
                });
            }
            // check if user is already blocked
            else if (product.block.indexOf(idUserBlock) === -1) {
                // add idUserBlock to blockedUsers
                product.block.push(idUserBlock);
                // save product
                await product.save();
                // send response
                return res.json({
                    message: 'success'
                });
            } else {
                // send response
                return res.json({
                    message: 'fail'
                });
            }
        } else {
            // send response
            return res.json({
                message: 'Not found'
            });
        }
    },

    detail: async (req, res) => {

        updateExpired();

        const productId = req.query.id;
        // find product by id

        const product = await ProductModel.findById(productId).lean();

        if (!product) {
            res.render('404', {
                layout: false
            });
            return;
        }

        let isOwner = false;

        if (res.locals.userLocal) {
            // check if user is owner of product
            if (product.seller === res.locals.userLocal._id.toString()) {
                isOwner = true;
            }
        }

        console.log(isOwner)

        const user = await UserModel.findById(product.seller).lean();
        product.sellDate = moment(product.sellDate).format('HH:MM DD/MM/YYYY');
        product.expDate = moment(product.expDate).format("YYYY-MM-DD HH:MM:SS");
        product.expDate = "" + moment(product.expDate).valueOf();


        let highestBidder = undefined;

        if (product.historyBidId.length > 0) {
            const lastProduct = product.historyBidId[product.historyBidId.length - 1];
            highestBidder = await UserModel.findById(lastProduct.username).lean();
            if (isOwner) {
                product.highestBidder = highestBidder.profile.name;
            } else {
                product.highestBidder = maskInfo(highestBidder.profile.name);
            }
            product.highestBidderId = lastProduct.username;
            product.highestBidderPoint = lastProduct.point;
        }

        for (let i = 0; i < product.historyBidId.length; i++) {
            const bid = product.historyBidId[i];
            const bidder = await UserModel.findById(bid.username).lean();
            if (isOwner) {
                product.historyBidId[i].username = bidder.profile.name;
            } else {
                product.historyBidId[i].username = maskInfo(bidder.profile.name);
            }
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

        // pick 5 product that have same category but not same id


        const productRelative = await ProductModel.find({
            category: product.category,
            _id: {
                $ne: productId
            }
        }).limit(5).lean();

        for (let i = 0; i < productRelative.length; i++) {
            const productRelativeItem = productRelative[i];
            const user = await UserModel.findById(productRelativeItem.seller).lean();
            productRelativeItem.numberBidders = productRelativeItem.historyBidId.length;
            var diff = moment.duration(moment(productRelativeItem.sellDate).diff(moment())).asHours();
            productRelativeItem.isNew = (0 < Math.abs(diff)) && (Math.abs(diff) < 24);
            productRelativeItem.sellDate = moment(productRelativeItem.sellDate).format('HH:MM DD/MM/YYYY');
            productRelativeItem.expDate = moment(productRelativeItem.expDate).format("YYYY-MM-DD HH:MM:SS");
            productRelativeItem.expDate = "" + moment(productRelativeItem.expDate).valueOf();

            if (isOwner) {
                productRelativeItem.seller = user.profile.name;
            } else {
                productRelativeItem.seller = maskInfo(user.profile.name);
            }

            productRelativeItem.numberBidders = productRelativeItem.historyBidId.length;
            productRelativeItem.username = user.profile.name;
            // product image is the first element
            productRelativeItem.image = productRelativeItem.images[0];
        }

        let username = undefined;
        let id = undefined;
        if (res.locals.userLocal) {
            username = res.locals.userLocal.profile.name;
            id = res.locals.userLocal._id;
            const myMap = new Map();
            const myMap2 = new Map();
            for (const wish of res.locals.userLocal.wishlist) {
                myMap.set(wish, wish);
            }
            const currentList = res.locals.userLocal.currentBiddingList;
            for (const current of currentList) {
                myMap2.set(current.idProduct, current.idProduct);
            }
            for (let i = 0; i < productRelative.length; i++) {
                productRelative[i].isWishlist = '' + productRelative[i]._id === '' + myMap.get(productRelative[i]._id + "");
                productRelative[i].isBidding = '' + productRelative[i]._id === '' + myMap2.get(productRelative[i]._id + "");
            }
        }

        let blockList;

        if (isOwner) {
            blockList = [];
            for (let i = 0; i < product.block.length; i++) {
                blockList.push(await UserModel.findById(product.block[i]).lean());
            }

        }

        res.render('detailProduct', {
            product,
            user,
            productRelative,
            username,
            isOwner,
            blockList
        });
    },

    index: async (req, res) => {

        updateExpired();

        const maincategory = req.query.maincategory;
        const search = req.query.search || "";
        const sort = req.query.sort;
        const subcategory = req.query.category || "";
        let maxItems = +req.query.limit || 12;
        let currentPage = +req.query.page || 1;
        let skipItem = (currentPage - 1) * maxItems;


        // if maxItems not in 12, 9, 6 return render 404 handlebars
        if (validLimit(maxItems) === false) {
            return res.render('404');
        }

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
            var diff = moment.duration(moment(products[i].sellDate).diff(moment())).asHours();
            products[i].isNew = (0 < Math.abs(diff)) && (Math.abs(diff) < 24);
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

        if (res.locals.userLocal) {
            username = res.locals.userLocal.profile.name;
            const currentList = res.locals.userLocal.currentBiddingList;
            id = res.locals.userLocal.id;
            const myMap = new Map();
            const myMap2 = new Map();
            for (const wish of res.locals.userLocal.wishlist) {
                myMap.set(wish, wish);
            }
            for (const current of currentList) {
                myMap2.set(current.idProduct, current.idProduct);
            }
            for (let i = 0; i < products.length; i++) {
                products[i].isWishlist = '' + products[i]._id === '' + myMap.get(products[i]._id + "");
                products[i].isBidding = '' + products[i]._id === '' + myMap2.get(products[i]._id + "");
            }
        }
        // wait for all async function to finish=
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
    },


}


export default productController;