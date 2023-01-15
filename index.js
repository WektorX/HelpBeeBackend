import { Routes } from './src/Routes/Routes.js';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'
import sendEmail from './src/Email/Email.js'
import { controller } from './src/Controller/Controller.js';
const app = express()
const port = 3000


app.use(bodyParser.json(), cors())


Routes.listenAuth(app);
Routes.listenUsers(app);
Routes.listenOffers(app);
Routes.listenRatings(app);

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
})