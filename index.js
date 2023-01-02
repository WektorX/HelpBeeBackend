import { Routes } from './src/Routes/Routes.js';
import express from 'express';
import bodyParser from 'body-parser';

const app = express()
const port = 3000


app.use(bodyParser.json())

Routes.listenAuth(app);
Routes.listenUsers(app);
Routes.listenOffers(app);


app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
})