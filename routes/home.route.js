import express from 'express';
import passport from 'passport';
import reCaptcha from '../middleware/recaptcha.js';
import validate from '../middleware/validate.js';
import ProductController from "../controllers/product.controller.js";

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
            for (const wish of res.locals.userLocal.wishlist) {
                myMap.set(wish, wish);
            }
            for (let i = 0; i < productRelativeBidding.length; i++) {
                productRelativeBidding[i].isWishlist = '' + productRelativeBidding[i]._id === '' + myMap.get(productRelativeBidding[i]._id + "");
            }

            for (let i = 0; i < productRelativeEnding.length; i++) {
                productRelativeEnding[i].isWishlist = '' + productRelativeEnding[i]._id === '' + myMap.get(productRelativeEnding[i]._id + "");
            }


            for (let i = 0; i < productRelativePricing.length; i++) {
                productRelativePricing[i].isWishlist = '' + productRelativePricing[i]._id === '' + myMap.get(productRelativePricing[i]._id + "");
            }
        }

        // wait for the productRelative to be loaded  // promise all

        console.log(productRelativeBidding)
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
            res.redirect('/');
        }
    );

router.route('/login/facebook')
    .get(passport.authenticate('login-facebook', {
        scope: 'email',
        failureRedirect: '/login',
        failureFlash: true
    }), async (req, res) => {
        res.redirect('/')
    });

router.route('/login/google')
    .get(passport.authenticate('login-google', {
        scope: [
            'profile', 'email'
        ],
        failureRedirect: '/login',
        failureFlash: true
    }), async (req, res) => {
        res.redirect('/')
    })

router.route('/login/github')
    .get(passport.authenticate('login-github', {
        scope: ['user:email'],
        failureRedirect: '/login',
        failureFlash: true
    }), async (req, res) => {
        res.redirect('/')
    });


router.route('/logout')
    .get((req, res) => {
        req.logOut();
        req.session.user = null;
        res.redirect('/login');
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
            res.redirect('/');
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


export default router;