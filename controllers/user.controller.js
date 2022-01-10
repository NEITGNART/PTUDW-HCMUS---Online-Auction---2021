import User from '../models/user.model.js';
import WinnigBid from '../models/winning.model.js';
import bcrypt from 'bcrypt';

export default {
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
                return;
            }
        } else {
            res.render('404');
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
        res.render('404');

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
                    isOwner = id == res.locals.userLocal._id;
                }

                const currentBid = user.currentBid || [];
                res.render('profile', {
                    user: user,
                    owner: isOwner,
                    islocal: user.method == 'local'
                });
                return;
            }
        }
        res.render('404');

    },
    async wishlist(req, res) { // user/wishlist
        // find user by id
        const {
            id
        } = req.query;
        const user = await User.findById(res.locals.userLocal._id);
        // check that wishlist that stored in user.wishlist
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