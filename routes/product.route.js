import express from 'express';
import controller from '../controllers/product.controller.js';

const router = express.Router();

router.route('/')
    .get(controller.listProduct);

router.route('/sort=price')
    .get(controller.sortProductByPrice);

router.route('/sort=time')
    .get(controller.sortProductByTime)



export default router;