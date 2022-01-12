import User from '../models/user.model.js';
import WinnigBid from '../models/winning.model.js';
import bcrypt from 'bcrypt';
import cloudinary from '../utils/cloudinary.js'
import {CloudinaryStorage} from "multer-storage-cloudinary"
import multer from "multer";
import Product from '../models/product.model.js'
import transporter from "../config/transporter.js";
import otpGenerator from 'otp-generator'


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "Product",
    },
});

export default {


    async verify(req, res) {

        const otp = "" + req.query.otp;

        console.log(req.query.otp);

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

    }

    ,
    async send(req, res) {
        const email = req.query.email;
        console.log(email);
        var otp = otpGenerator.generate(30, {upperCaseAlphabets: false, specialChars: false});
        console.log(otp);
        const url = "http://localhost:3000/user/verify?opt=" + otp;

        var mailOptions = {
            to: email,
            subject: "Otp for registration is: ",
            html: `<h3>OTP for account verification is </h3>"> 
                    <a href=${url}>Visit Aution Online!</a>
                "<h1 style='font-weight:bold;'></h1>" `
        };


        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
        });
        return res.status(200).json({
            message: "OTP sent to your email"
        })
    },


    async postProduct(req, res) {
        res.render('postProduct');
    },


    upload: async (req, res) => {

        const upload = multer({
            storage: storage
        }).array("imageList", 3);


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

                const currentBid = user.currentBid || [];
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
        }
        res.render('404', {
            layout: false
        });

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