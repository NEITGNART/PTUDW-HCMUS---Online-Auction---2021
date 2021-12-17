import express from 'express';
import auth from '../middleware/auth.mdw.js';
import controller from '../controllers/user.controller.js';

const router = express.Router();

router.route('/')
    .get(auth, controller.dashboard);

router.route('/profile')
    .get(auth, controller.profile);

router.route('/wishlist')
    .get(auth, controller.wishlist);



export default router;