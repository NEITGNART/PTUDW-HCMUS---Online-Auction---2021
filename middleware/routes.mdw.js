// import { dirname } from 'path';
// import { fileURLToPath } from 'url';
// const __dirname = dirname(fileURLToPath(import.meta.url));

import adminRoute from '../routes/admin.route.js';
import categoryRoute from '../routes/category.route.js';
import homeRoute from '../routes/home.route.js';
import productRoute from '../routes/product.route.js';
import userRoute from '../routes/user.route.js';


export default (app) => {
    app.use('/', homeRoute);
    app.use('/admin', adminRoute);
    app.use('/category', categoryRoute);
    app.use('/product', productRoute);
    app.use('/user', userRoute);

    app.use(function (req, res, next) {
        res.render('404', {
            layout: false
        });
    });

    app.use(function (err, req, res, next) {
        console.error(err.stack)
        res.render('500', {
            layout: false
        });
    });
}