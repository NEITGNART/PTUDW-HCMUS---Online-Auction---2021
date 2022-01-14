import express from 'express';
import adminController from '../controllers/admin.controller.js';
import auth from '../middleware/auth.mdw.js';
import authAdmin from '../middleware/authAdmin.mdw.js';
import categoryController from "../controllers/category.controller.js";

const router = express.Router();

router.route('/')
    .get(auth, authAdmin, adminController.getPending)

router.route('/addcategory') // done
    .post(auth, authAdmin, categoryController.create);

router.route('/removecategory') // done
    .post(auth, authAdmin, categoryController.deleteCategory);

router.route('/removesubcategory') // done
    .post(auth, authAdmin, categoryController.removeSubcategory);


router.route('/addsubcategory') // done
    .post(auth, authAdmin, categoryController.createSubCategory);

router.route('/updatecategory') // done
    .post(auth, authAdmin, categoryController.update);

router.route('/updatesubcategory') // done
    .post(auth, authAdmin, categoryController.updateSubcategory);


router.route('/user')
    .get(auth, authAdmin, (adminController.viewListUser));

router.route('/user/detail')
    .get(auth, authAdmin, adminController.findUser);

router.route('/product')
    .get(auth, authAdmin, adminController.viewListProduct)

router.route('/remove')
    .post(auth, authAdmin, adminController.deleteProduct);

router.route('/category')
    .get(auth, authAdmin, categoryController.getAll)

router.route('/approve')
    .post(auth, authAdmin, adminController.approveBidder);

router.route('/degrade')
    .post(auth, authAdmin, adminController.degrade);

router.route('/toast')
    .get(auth, authAdmin, (req, res) => {
        res.render('toast', {
            layout: 'admin'
        });
    });

export default router;