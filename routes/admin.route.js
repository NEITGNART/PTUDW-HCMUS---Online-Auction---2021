import express from 'express';

const router = express.Router();

router.route('/')
    .get((req, res) => {
        res.render('dashboard-admin',{layout: 'admin'});
    });

router.route('/management/user')
    .get((req, res) => {
        res.render('management-user',{layout: 'admin'});
    });

router.route('/management/product')
    .get((req, res) => {
        res.render('management-product',{layout: 'admin'});
    });

router.route('/management/category')
    .get((req, res) => {
        res.render('management-category',{layout: 'admin'});
    });

router.route('/toast')
    .get((req, res) => {
        res.render('toast',{layout: 'admin'});
    });

export default router;