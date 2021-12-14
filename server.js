// use .env
import 'dotenv/config';
import config from './config/config.js';
import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
// import passport from 'passport';

import active_local_middleware from './middleware/locals.mdw.js';
import active_view_middleware from './middleware/view.mdw.js';
import active_route_middleware from './middleware/routes.mdw.js';

const app = express()
app.use(express.static('public'));

app.use(morgan('dev'))
app.use(express.urlencoded({
    extended: true
}));


// app.use(passport.initialize());
// app.use(passport.session());

active_local_middleware(app);
active_view_middleware(app);
active_route_middleware(app);


mongoose.connect(config.URI, {}, err => {
    if (err) {
        throw err;
    }
    console.log('Connected to MongoDB')
})


// test database and model
// try {
//     var cate = new cat({
//         name: "Điện tử",
//         amount: 5,
//         subCat: ["Máy tính", "Di động"],
//         amountSubCat: [2, 3]
//     })

//     await cate.save();

// } catch (error) {
//     throw error;
// }


app.listen(config.PORT, () => {
    console.log(`Example app listening at http://localhost:${config.PORT}`)
})