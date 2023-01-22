import { Routes } from './src/Routes/Routes.js';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'
const app = express()
const port = 3000

app.use(bodyParser.json(), cors())

Routes.listenUsers(app);
Routes.listenOffers(app);
Routes.listenRatings(app);
Routes.listenChat(app);

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
})