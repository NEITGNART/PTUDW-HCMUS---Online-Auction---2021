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
import transporter from "./config/transporter.js";



const app = express()


app.use(express.static('public'));


app.use(morgan('dev'))
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());


//////////////////////////////////
//
//  active sesion trước khi passport config
//
/////////////////////////////////
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

app.listen(config.PORT, () => {
    console.log(`Example app listening at http://localhost:${config.PORT}`)
});