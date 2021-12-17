import 'dotenv/config';
import config from './config/config.js';

import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import passport from 'passport';


import passportConfig from './config/passport.js';
import active_local_middleware from './middleware/locals.mdw.js';
import active_view_middleware from './middleware/view.mdw.js';
import active_route_middleware from './middleware/routes.mdw.js';
import active_session_middleware from './middleware/session.mdw.js';

const app = express()

app.use(express.static('public'));


app.use(morgan('dev'))


app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

//////////
//
//  active sesion trước khi passport config
//
///////////
active_session_middleware(app);
passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());
// đừng đảo thứ tự cụm trên
////////////////////////////



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


// try {
//     var cate = new category({
//         name: "Điện tử 3",
//         amount: 5,
//         subCat: ["Máy tính 1", "Di động"],
//         amountSubCat: [2, 3, 5],

//     });
//     await cate.save();
// } catch (error) {
//     throw error;
// }

// import category from './models/category.model.js';
// (async function a() {
//     const a = await category.find({
//         $text: {
//             $search: 'Điện'
//         }
//     });
//     console.log(a);
// })();


app.listen(config.PORT, () => {
    console.log(`Example app listening at http://localhost:${config.PORT}`)
})