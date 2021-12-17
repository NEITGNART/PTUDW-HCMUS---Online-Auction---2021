import express from 'express';
import controller from '../controllers/product.controller.js';

const router = express.Router();

router.route('/')
    .get(controller.listProduct);

export default router;