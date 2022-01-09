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

export default router;