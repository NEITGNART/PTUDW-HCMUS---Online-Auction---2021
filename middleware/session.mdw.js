import 'dotenv/config';
import config from '../config/config.js';
import flash from 'connect-flash';
import session from 'express-session';

export default function (app) {
    app.use(flash());
    app.use(session({
        secret: config.SECRET || env.SECRET,
        resave: true,
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            maxAge: 1000 * 3600 * 24
        }
    }));
}