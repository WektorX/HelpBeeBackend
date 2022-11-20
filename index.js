const express = require('express')
// Connect to firebase
const fs = require('firebase-admin');
const serviceAccount = require('./firebase_key.json');
fs.initializeApp({
    credential: fs.credential.cert(serviceAccount)
});
const db = fs.firestore();
const usersDb = db.collection('users');

const app = express()
const port = 3000


app.get('/', (req, res) => {
    res.end('Hello World!');
});


/*==========================POST====================================*/
app.post('/register', async (req, res) => {
    try {
        console.log(req.body);
        const id = req.body.email;
        const userJson = {
            userID : req.body.userID,
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNumber: req.body.phoneNumber
        };
        const usersDb = db.collection('users');
        const response = await usersDb.doc(id).set(userJson);
        res.send(response);
    } catch (error) {
        res.send(error);
    }
});


/*==========================GET====================================*/

app.get('/read/:id', async (req, res) => {
    try {
        const userRef = db.collection("users").doc(req.params.id);
        const response = await userRef.get();
        res.send(response.data());
    } catch (error) {
        res.send(error);
    }
});


app.get('/name', async (req, res) => {
    try {
        const userRef = db.collection("users");
        userRef.where('firstName', '==', 'Wiktor')
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log(doc.id, ' => ' , doc.data())
                    res.send(doc.data())
                })
            })
    } catch (error) {
        console.log(error)
    }
});



app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
})