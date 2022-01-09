import User from '../models/user.model.js';
import WinnigBid from '../models/winning.model.js';

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
                if (res.locals.user) {
                    isOwner = id == res.locals.user._id;
                }

                const currentBid = user.currentBid || [];
                res.render('profile', {
                    user: user,
                    owner: isOwner,
                    islocal: user.type == 'local'
                });
                return;
            }
        } else {
            res.render('404');
        }
    },
    async wishlist(req, res) { // user/wishlist
        // find user by id
        const {
            id
        } = req.query;
        const user = await User.findById(res.locals.user._id);
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

        res.json({
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