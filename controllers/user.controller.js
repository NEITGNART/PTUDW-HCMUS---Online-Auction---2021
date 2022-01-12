import User from '../models/user.model.js';
import WinnigBid from '../models/winning.model.js';
import bcrypt from 'bcrypt';
import cloudinary from '../utils/cloudinary.js'
import {CloudinaryStorage} from "multer-storage-cloudinary"
import multer from "multer";
import Product from '../models/product.model.js'
import moment from 'moment';
import CategoryModel from "../models/category.model.js";


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "Product",
    },
});

export default {


    async verify(req, res) {

        const otp = "" + req.query.otp;

        const user = await User.findOne({
            confirmationCode: otp
        });

        if (!user || user.status === 'Active') {
            return res.render('404', {
                layout: false
            });
        }

        user.status = 'Active';
        user.confirmationCode = null;
        await user.save();

        return res.render('verify', {
            title: 'Verify',
            layout: false
        })

    },

    async postProduct(req, res) {
        // get all categories
        const categories = await CategoryModel.find({}).lean();

        console.log(categories);

        res.render('postProduct', {
            categories
        });
    },


    upload: async (req, res) => {

        const upload = multer({
            storage: storage
        }).array("imageList", 5);


        // upload images to cloudinary
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).send({
                    message: "Error uploading image"
                });
            }

            const images = req.files.map(file => file.path);

            console.log(req.body);

            // create a set
            const set = new Set(images);

            // split ',' in each category
            const hashMap = {};

            let categorySaveInProduct = [];

            for (let i = 0; i < req.body.category.length; i++) {

                req.body.category[i] = req.body.category[i].split(',');
                const category = req.body.category[i][1];
                const subCategory = req.body.category[i][0];

                if (hashMap[category]) {
                    hashMap[category].push(subCategory);
                } else {
                    hashMap[category] = [subCategory];
                }
            }

            // loop through hashmap
            for (let key in hashMap) {
                // loop through sub key
                for (let i = 0; i < hashMap[key].length; i++) {
                    // push category object to categorySaveInProduct
                    categorySaveInProduct.push(hashMap[key][i]);
                }
                categorySaveInProduct.push(key);
            }

            categorySaveInProduct = [...new Set(categorySaveInProduct)];

            // find category which has name is same as the key in hashmap

            const category = await CategoryModel.find({
                name: {
                    $in: Object.keys(hashMap)
                }
            });

            // adding number of subcategory to each category
            for (let i = 0; i < category.length; i++) {
                category[i].amount++;
                for (let j = 0; j < category[i].subCat.length; j++) {
                    const temp = hashMap[category[i].name]
                    if (temp.includes(category[i].subCat[j])) {
                        category[i].amountSubCat[j]++;
                    }
                }
            }
            for (let i = 0; i < category.length; i++) {
                await CategoryModel.findByIdAndUpdate(category[i]._id, category[i]);
            }


            const product = new Product({


                name: req.body.nameProduct,
                description: req.body.description,
                category: categorySaveInProduct || [],
                currentPrice: +req.body.currentPrice,
                // convert date from string to date using moment
                expDate: req.body.expDate ? new Date(req.body.expDate) : new Date() + 24 * 60 * 60 * 1000,
                bestPrice: +req.body.bestPrice,
                stepPrice: +req.body.nextPrice,
                images: images,
                seller: res.locals.userLocal._id,
                autoExtend: (+req.body.autoExtend === 1),
            });
            try {
                product.save();
            } catch (e) {
                res.status(400).send({
                    message: "Error uploading image"
                });
            }
        });
        return res.status(200).send({
            message: "Uploaded successfully"
        });

    },
    async dashboard(req, res) {
        const id = req.query.id;
        if (id) {
            const user = await User.findById(id).lean();
            const itemswon = await WinnigBid.find({
                userId: id,
            });

            if (user) {
                var nItems = 0
                if (itemswon) {
                    nItems = itemswon.length;
                }

                const currentBid = user.currentBiddingList || [];
                res.render('dashboard', {
                    user: user,
                    activebid: currentBid.length,
                    itemwon: nItems
                });

            }
        } else {
            res.render('404', {
                layout: false
            });
        }
    },
    async updateProfile(req, res) {
        const id = req.query.id;
        if (id && req.body) {
            const user = await User.findById(id);
            if (user) {
                if (req.body.email) {
                    const checkEmail = await User.findOne({
                        profile: {
                            email: req.body.email
                        }
                    });
                    console.log(checkEmail);
                    if (!checkEmail || checkEmail._id === user._id) {
                        user.profile.email = req.body.email;
                    }
                } else if (user.method === "local" && req.body.newpass && req.body.oldpass) {
                    const matched = await bcrypt.compare(req.body.oldpass, user.secret);
                    if (matched) {
                        const salt = bcrypt.genSaltSync(10);
                        const password = bcrypt.hashSync(req.body.newpass, salt);
                        user.secret = password;
                    }
                } else {
                    user.profile.name = req.body.name || user.profile.name;
                    user.profile.address = req.body.address || user.profile.address;
                }
                await user.save();
                res.redirect(req.session.retUrl);
            }
        }
        res.render('404', {
            layout: false
        });

    },
    async profile(req, res) {
        const id = req.query.id;
        if (id) {
            const user = await User.findById(id).lean();
            const itemswon = await WinnigBid.find({
                userId: id,
            });

            if (user) {
                var nItems = 0;
                var isOwner = false;
                if (itemswon) {
                    nItems = itemswon.length;
                }
                if (res.locals.userLocal) {
                    console.log(typeof (res.locals.userLocal._id));
                    console.log(res.locals.userLocal._id.toString());
                    isOwner = (id === res.locals.userLocal._id.toString());
                }

                const currentBid = user.currentBid || [];
                res.render('profile', {
                    user: user,
                    owner: isOwner,
                    islocal: user.method === 'local',
                    isBidder: user.type === 'bidder',
                    // isPending: (!user.request.isAccepted && user.request.isRequest) || false,
                });
                return;
            }
        }
        res.render('404', {
            layout: false
        });

    },
    async upgradeRole(req, res) {
        const id = req.query.id;
        if (req.user.type !== 'bidder') {
            res.redirect(`/user/profile?id=${id}`);
            return;
        }
        if (id) {
            const user = await User.findById(id).lean();

            if (user) {
                user.request.isAccepted = false;
                user.request.isRequest = true;
                user.save();
            }
            res.redirect(`/user/profile?id=${id}`);
            return;
        }
        res.render('404');

    },
    async wishlist(req, res) { // user/wishlist
        // find user by id
        const id = req.query.id;
        const user = await User.findById(res.locals.userLocal._id);
        // // check that wishlist that stored in user.wishlist
        // contains the product id
        const isInWishlist = user.wishlist.includes(id);
        if (isInWishlist) {
            // remove product id from wishlist
            user.wishlist = user.wishlist.filter(productId => productId !== id);
        } else {
            // add product id to wishlist
            user.wishlist.push(id);
        }
        // save user
        if (!user.currentBiddingList) {
            user.currentBiddingList = [];
        }
        await user.save();

        return res.json({
            success: !isInWishlist
        });

    },
    async showWishList(req, res) {
        const id = req.query.id;
        const user = await User.findById(id);
        if (user) {
            const wishList = user.wishlist;
            const wishProducts = [];
            for (let i = 0; i < wishList.length; i++) {
                wishProducts.push(await Product.findById(wishList[i]).lean());
                wishProducts[i].expDate = moment(wishProducts[i].expDate).format("YYYY-MM-DD HH:MM:SS");
                wishProducts[i].expDate = "" + moment(wishProducts[i].expDate).valueOf();
                wishProducts[i].numberBidders = wishProducts[i].historyBidId.length;
            }
            res.render('wishlist', {
                user: user,
                wishProducts: wishProducts,
                username: res.locals.userLocal.profile.name,
            })
        } else {
            res.render('404');
        }

    },
    async mybid(req, res) {
        const id = req.query.id;
        const user = await User.findById(id);
        if (user) {
            const currentBid = user.currentBiddingList;
            const currentProducts = [];
            for (let i = 0; i < currentBid.length; i++) {
                currentProducts.push(await Product.findById(currentBid[i].idProduct).lean());
                currentProducts[i].expDate = moment(currentProducts[i].expDate).format("YYYY-MM-DD HH:MM:SS");
                currentProducts[i].expDate = "" + moment(currentProducts[i].expDate).valueOf();
                currentProducts[i].numberBidders = currentProducts[i].historyBidId.length;
            }
            var username = "";
            if (res.locals.userLocal) {
                username = res.locals.userLocal.profile.name;
            }

            const myMap = new Map();
            for (const wish of user.wishlist) {
                myMap.set(wish, wish);
            }
            for (let i = 0; i < currentProducts.length; i++) {
                currentProducts[i].isWishlist = '' + currentProducts[i]._id === '' + myMap.get(currentProducts[i]._id + "");
            }
            res.render('myBid', {
                user: user,
                currentProducts: currentProducts,
                username: username,
            })
        } else {
            res.render('404');
        }
    },
    async winningbid(req, res) {
        const id = req.query.id;
        const user = await User.findById(id);
        if (user) {
            const winningList = await WinnigBid.find({
                userId: id
            });
            const winnignProducts = [];
            for (let i = 0; i < winningList.length; i++) {
                winnignProducts.push(await Product.findById(winningList[i].productId).lean());
                winnignProducts[i].expDate = moment(winnignProducts[i].expDate).format("YYYY-MM-DD HH:MM:SS");
                winnignProducts[i].expDate = "" + moment(winnignProducts[i].expDate).valueOf();
                winnignProducts[i].numberBidders = winnignProducts[i].historyBidId.length;
            }
            var username = "";
            if (res.locals.userLocal) {
                username = res.locals.userLocal.profile.name;
            }

            const myMap = new Map();
            for (const wish of user.wishlist) {
                myMap.set(wish, wish);
            }
            for (let i = 0; i < winnignProducts.length; i++) {
                winnignProducts[i].isWishlist = '' + winnignProducts[i]._id === '' + myMap.get(winnignProducts[i]._id + "");
            }
            res.render('winningBid', {
                user: user,
                winnignProducts: winnignProducts,
                username: username,
            })
        } else {
            res.render('404');
        }
    },
    async feedback(req, res) {
        const id = req.query.id;
        const user = await User.findById(id).lean();
        if (user) {
            var reviewsList = user.reviews;

            for (let i = 0; i < reviewsList.length; i++) {
                reviewsList[i].isLike = (reviewsList[i].point > 0);
                var temp = await User.findById(reviewsList[i].author);
                reviewsList[i].date = moment(reviewsList[i].date).format('HH:MM DD/MM/YYYY');
                reviewsList[i].authorName = temp.profile.name;
                reviewsList[i].userAvatar = temp.profile.avatar || '/img/c1.png';
            }
            res.render('myfeedback', {
                reviewsList: reviewsList,
                isHaveFeedBack: reviewsList.length > 0
            })
        } else {
            res.render('404');
        }
    },
    async myproduct(req, res) {
        const id = req.query.id;
        const user = await User.findById(id);
        if (user) {
            const myProducts = await Product.find({
                seller: id
            });
            const productList = [];
            for (let i = 0; i < myProducts.length; i++) {
                productList.push(await Product.findById(myProducts[i]._id).lean());
                productList[i].expDate = moment(productList[i].expDate).format("YYYY-MM-DD HH:MM:SS");
                productList[i].expDate = "" + moment(productList[i].expDate).valueOf();
                productList[i].numberBidders = productList[i].historyBidId.length;
            }
            var username = "";
            if (res.locals.userLocal) {
                username = res.locals.userLocal.profile.name;
            }

            const myMap = new Map();
            for (const wish of user.wishlist) {
                myMap.set(wish, wish);
            }
            for (let i = 0; i < productList.length; i++) {
                productList[i].isWishlist = '' + productList[i]._id === '' + myMap.get(productList[i]._id + "");
            }
            res.render('myProduct', {
                user: user,
                productList: productList,
                username: username,
            })
        } else {
            res.render('404');
        }
    },
    async isCanSignUp(req, res) {
        const email = req.query.email || '';
        const authId = req.query.authId || '';

        if (authId) {
            // check that authId that exist in user.auth
            // FIND one by authId
            const user = await User.findOne({
                authId: authId
            });

            if (user) {
                return res.json({
                    success: false,
                });
            } else {
                return res.json({
                    success: true,
                });
            }
        }

        if (email) {
            const user = await User.findOne({
                'profile.email': email
            });
            if (user) {
                return res.json({
                    success: false,
                });
            } else {
                return res.json({
                    success: true,
                });
            }
        }

        return res.json({
            success: true
        });


    }
};