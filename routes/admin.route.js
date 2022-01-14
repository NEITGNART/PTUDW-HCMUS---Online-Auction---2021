import express from 'express';
import adminController from '../controllers/admin.controller.js';
import categoryController from "../controllers/category.controller.js";

const router = express.Router();

router.route('/')
    .get(adminController.getPending)

router.route('/addcategory') // done
    .post(categoryController.create);

router.route('/removecategory') // done
    .post(categoryController.deleteCategory);

router.route('/removesubcategory') // done
    .post(categoryController.removeSubcategory);


router.route('/addsubcategory') // done
    .post(categoryController.createSubCategory);

router.route('/updatecategory') // done
    .post(categoryController.update);

router.route('/updatesubcategory') // done
    .post(categoryController.updateSubcategory);


router.route('/user')
    .get((adminController.viewListUser));

router.route('/user/detail')
    .get(adminController.findUser);

router.route('/product')
    .get(adminController.viewListProduct)

router.route('/remove')
    .post(adminController.deleteProduct);

router.route('/category')
    .get(categoryController.getAll)

router.route('/approve')
    .post(adminController.approveBidder);

router.route('/degrade')
    .post(adminController.degrade);

router.route('/toast')
    .get((req, res) => {
        res.render('toast', {layout: 'admin'});
    });

export default router;