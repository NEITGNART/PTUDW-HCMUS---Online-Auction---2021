import User from '../models/user.model.js';

export default {
    dashboard(req, res) {
        res.render('dashboard');
    },
    profile(req, res) {
        res.render('profile');
    },
    wishlist(req, res) {
        res.render('wishlist');
    }
};