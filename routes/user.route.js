import express from 'express';
import auth from '../middleware/auth.mdw.js';
import controller from '../controllers/user.controller.js';

const router = express.Router();

router.route('/')
    .get(auth, controller.dashboard);

router.route('/profile')
    .get(auth, controller.profile)
    .post(auth, controller.updateProfile);

router.route('/wishlist')
    .get(auth, controller.wishlist);

router.route('/mybid')
    .get(auth, controller.mybid);

router.route('/winningbid')
    .get(auth, controller.winningbid);

router.route('/feedback')
    .get(auth, controller.feedback);

router.route('/myproduct')
    .get(auth, controller.myproduct);

router.route('/postproduct')
    .get((req, res) => {
        res.render('postProduct');
    })


export default router;