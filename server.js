import 'dotenv/config';
import express from 'express';


import config from './config/config.js';

const app = express()

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(config.PORT, () => {
    console.log(`Example app listening at http://localhost:${config.PORT}`)
})
