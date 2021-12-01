import 'dotenv/config';
import config from './config/config.js';
import mongoose from 'mongoose';

export default () => {
    console.log(config.DB);
}
// mongoose.connect(config.DB)