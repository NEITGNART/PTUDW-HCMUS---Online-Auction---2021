import express from 'express';
import passport from 'passport';

const router = express.Router();

router.route('/')
    .get((req, res) => {
        res.render('home');
    });

router.route('/login')
    .get((req, res) => {
        res.render('login');
    })
    .post(passport.authenticate('login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }));

router.route('/login/facebook')
    .get(passport.authenticate('login-facebook', {
        scope: 'email',
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }));

router.route('/login/google')
    .get(passport.authenticate('login-google', {
        scope: [
            'profile'
        ],
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }))

router.route('/login/github')
    .get(passport.authenticate('login-github', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }))


router.route('/logout')
    .get((req, res) => {
        req.logOut();
        req.session.user = null;
        res.redirect('/login');
    });


router.route('/signup')
    .get((req, res) => {
        res.render('signup');
    });


router.route('/register')
    .get((req, res) => {
        res.render('register');
    });


router.route('/about')
    .get((req, res) => {
        res.render('about');
    });


export default router;