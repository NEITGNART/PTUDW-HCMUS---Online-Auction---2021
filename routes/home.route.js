import express from 'express';
import passport from 'passport';
import reCaptcha from '../middleware/recaptcha.js';
import validate from '../middleware/validate.js';
import ProductController from "../controllers/product.controller.js";

import axios from 'axios';

const router = express.Router();

router.route('/')
    .get(async (req, res) => {
        const productRelativeBidding = await ProductController.topBidding();
        const productRelativeEnding = await ProductController.topEnding();
        const productRelativePricing = await ProductController.topPricing();


        let username = undefined;
        let id = undefined;

        if (res.locals.userLocal) {
            username = res.locals.userLocal.profile.name;
            id = res.locals.userLocal.id;
            const myMap = new Map();
            const myMap2 = new Map();
            for (const wish of res.locals.userLocal.wishlist) {
                myMap.set(wish, wish);
            }
            const currentList = res.locals.userLocal.currentBiddingList;
            for (const current of currentList) {
                myMap2.set(current.idProduct, current.idProduct);
            }
            for (let i = 0; i < productRelativeBidding.length; i++) {
                productRelativeBidding[i].isWishlist = '' + productRelativeBidding[i]._id === '' + myMap.get(productRelativeBidding[i]._id + "");
                productRelativeBidding[i].isBidding = '' + productRelativeBidding[i]._id === '' + myMap2.get(productRelativeBidding[i]._id + "");
            }

            for (let i = 0; i < productRelativeEnding.length; i++) {
                productRelativeEnding[i].isWishlist = '' + productRelativeEnding[i]._id === '' + myMap.get(productRelativeEnding[i]._id + "");
                productRelativeEnding[i].isBidding = '' + productRelativeEnding[i]._id === '' + myMap2.get(productRelativeEnding[i]._id + "");
            }


            for (let i = 0; i < productRelativePricing.length; i++) {
                productRelativePricing[i].isWishlist = '' + productRelativePricing[i]._id === '' + myMap.get(productRelativePricing[i]._id + "");
                productRelativePricing[i].isBidding = '' + productRelativePricing[i]._id === '' + myMap2.get(productRelativePricing[i]._id + "");
            }
        }

        // wait for the productRelative to be loaded  // promise all

        // console.log(productRelativeBidding)
        res.render('home', {
            productRelativeBidding,
            productRelativeEnding,
            productRelativePricing
        });
    })


router.route('/login')
    .get((req, res) => {
        res.render('login');
    })
    .post(passport.authenticate('login', {
            failureRedirect: '/login',
            failureFlash: true
        }),
        async (req, res) => {

            const returnUrl = req.session.retUrl || '/';
            res.redirect(returnUrl);
        }
    );

router.route('/login/facebook')
    .get(passport.authenticate('login-facebook', {
        scope: 'email',
        failureRedirect: '/login',
        failureFlash: true
    }), async (req, res) => {
        const returnUrl = req.session.retUrl || '/';
        res.redirect(returnUrl)
    });

router.route('/login/google')
    .get(passport.authenticate('login-google', {
        scope: [
            'profile', 'email'
        ],
        failureRedirect: '/login',
        failureFlash: true
    }), async (req, res) => {
        const returnUrl = req.session.retUrl || '/';
        res.redirect(returnUrl)
    })

router.route('/login/github')
    .get(passport.authenticate('login-github', {
        scope: ['user:email'],
        failureRedirect: '/login',
        failureFlash: true
    }), async (req, res) => {
        const returnUrl = req.session.retUrl || '/';
        res.redirect(returnUrl)
    });


router.route('/logout')
    .get((req, res) => {
        req.logOut();
        req.session.user = null;
        const returnUrl = req.session.retUrl || '/login';
        res.redirect(returnUrl);
    });


router.route('/signup')
    .get((req, res) => {
        res.render('signup');
    })
    .post(reCaptcha, validate.signUp, passport.authenticate('signup', {
            failureRedirect: '/signup',
            failureFlash: true
        }),
        async (req, res) => {

            const returnUrl = req.session.retUrl || '/';
            res.redirect(returnUrl);
        });

router.route('/forgetPass')
    .get((req, res) => {
        res.render('forgetPass');
    })
// .post()


router.route('/about')
    .get((req, res) => {
        res.render('about');
    });

router.route('/toast')
    .get((req, res) => {
        res.render('toast');
    })


export default router;