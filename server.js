// use .env
import 'dotenv/config';
import config from './config/config.js';
import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';

import active_local_middleware from './middleware/locals.mdw.js';
import active_view_middleware from './middleware/view.mdw.js';
import active_route_middleware from './middleware/routes.mdw.js';

const app = express()
app.use(morgan('dev'))
app.use(express.urlencoded({
    extended: true
}));

active_local_middleware(app);
active_view_middleware(app);
active_route_middleware(app);

mongoose.connect(config.DB, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, err => {
    if (err) {
        // throw err;
        console.log('----------------------- Can\'t connect to MongoDB');
    }
    console.log('Connected to MongoDB')
})

app.listen(config.PORT, () => {
    console.log(`Example app listening at http://localhost:${config.PORT}`)
})