import User from '../models/user.model.js';

export default {
    dashboard(req, res) {
        res.render('dashboard');
    },
    profile(req, res) {
        res.render('profile');
    },
    async wishlist(req, res) { // user/wishlist
        // find user by id
        const {id} = req.query;
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

    }
};