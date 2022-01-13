import express from 'express';
import controller from '../controllers/product.controller.js';
import auth from '../middleware/auth.mdw.js';
import authSeller from '../middleware/authSeller.mdw.js';

const router = express.Router();


router.route('/')
    .get(controller.index);

router.route('/detail')
    .get(controller.detail)
    .post(authSeller, controller.updateDescription);

router.route('/bidding')
    .post(auth, controller.autoBidding);

router.route('/block')
    .post(authSeller, controller.blockUser)



export default router;