import User from '../models/user.model.js';
import WinnigBid from '../models/winning.model.js';
import cloudinary from '../utils/cloudinary.js'
import {CloudinaryStorage} from "multer-storage-cloudinary"
import multer from "multer";
import Product from '../models/product.model.js'

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "Product",
    },
});

export default {


    async postProduct(req, res) {
        res.render('postProduct');
    },


    upload: async (req, res) => {

        // using multer-storage-cloudinary to upload images to cloudinary and get url
        const upload = multer({storage: storage}).array("imageList", 5);

        // upload images to cloudinary
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).send({
                    message: "Error uploading image"
                });
            }
            const images = req.files.map(file => file.path);
            const product = new Product({
                name: req.body.nameProduct,
                description: req.body.description,
                category: req.body.category || [],
                currentPrice: +req.body.currentPrice,
                bestPrice: +req.body.bestPrice,
                stepPrice: +req.body.nextPrice,
                images: images,
                seller: res.locals.userLocal._id,
                autoExtend: (+req.body.autoExtend === 1),
            });
            try {
                await product.save();
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

                const currentBid = user.currentBid || [];
                res.render('dashboard', {
                    user: user,
                    activebid: currentBid.length,
                    itemwon: nItems
                });

            }
        } else {
            res.render('404');
        }
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
                    isOwner = id === res.locals.userLocal._id;
                }

                const currentBid = user.currentBid || [];
                res.render('profile', {
                    user: user,
                    owner: isOwner,
                    islocal: user.method === 'local'
                });
                return;
            }
        } else {
            res.render('404');
        }
    },
    async wishlist(req, res) { // user/wishlist
        // find user by id
        const id = req.query.id;
        console.log(id)
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
    mybid(req, res) {

    },
    winningbid(req, res) {

    },
    feedback(req, res) {

    },
    myproduct(req, res) {

    },
};