import express from 'express';
import auth from '../middleware/auth.mdw.js';
import authSeller from '../middleware/authSeller.mdw.js';
import controller from '../controllers/user.controller.js';

const router = express.Router();

router.route('/')
    .get(auth, controller.dashboard);

router.route('/profile')
    .get(auth, controller.profile)
    .post(auth, controller.updateProfile);

router.route('/wishlist')
    .get(auth, controller.showWishList)
    .post(auth, controller.wishlist);

router.route('/mybid')
    .get(auth, controller.mybid);

router.route('/winningbid')
    .get(auth, controller.winningbid);

router.route('/feedback')
    .get(auth, controller.feedback)
    .post(auth, controller.givefeedback);

router.route('/myproduct')
    .get(auth, controller.myproduct);

router.route('/upgraderole')
    .get(auth, controller.upgradeRole);

router.route('/postproduct')
    .get(authSeller, controller.postProduct)
    .post(authSeller, controller.upload)

router.route('/verify')
    .get(controller.verify);

router.route('/cansignup')
    .get(controller.isCanSignUp);

router.route('/getpoint')
    .get(controller.isEnoughPoint);



export default router;