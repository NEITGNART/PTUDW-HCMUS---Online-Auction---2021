import express from 'express';
import adminController from '../controllers/admin.controller.js';

const router = express.Router();

router.route('/')
    .get((req, res) => {
        res.render('dashboard-admin', {layout: 'admin'});
    });


router.route('/user')
    .get((adminController.viewListUser));

router.route('/user/detail')
    .get(adminController.findUser);

router.route('/product')
    .get((req, res) => {
        res.render('management-product', {layout: 'admin'});
    });

router.route('/category')
    .get((req, res) => {
        res.render('management-category', {layout: 'admin'});
    });


router.route('/toast')
    .get((req, res) => {
        res.render('toast', {layout: 'admin'});
    });

export default router;