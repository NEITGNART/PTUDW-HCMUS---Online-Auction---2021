import express from 'express';
import controller from '../controllers/product.controller.js';
import auth from '../middleware/auth.mdw.js';

const router = express.Router();


router.route('/')
    .get(controller.index);

router.route('/detail')
    .get(controller.detail)
    .post(auth, controller.updateDescription);

router.route('/block')
    .post(auth, controller.blockUser)


export default router;