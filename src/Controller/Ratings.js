import {db} from '../Database/DB.js';
import fs from 'firebase-admin';
import sendEmail from '../Email/Email.js';


async function insertRate(req, res){
    const rating = req.body.rating;
    let workerID = rating.workerID;
    let userID = rating.employerID;
    let rate = rating.rating;
    let comment = rating.comment;
    const result = await db.ratings.insertRate(rating);
    if(result == true){
        const userContact = await db.users.getUserContactInfo(userID)
        const workerContact = await db.users.getUserContactInfo(workerID);
        let text = "Użytkownik " + userContact.firstName + " " + userContact.lastName.charAt(0) + ". wystawił ci ocenę " + rate.toFixed(1) +".";
        if(comment != ''){
            text += 'Dodał także komentarz \"' + comment + "\".";
        } 
        sendEmail(workerContact.email, "Nowa ocena", text)
    }
    res.status(200).send({message: result})
}


async function getComments(req, res){
    const uid = req.query.uid;
    const result = await db.ratings.getComments(uid);
    res.status(200).send(result)
}


async function getRatings(req, res){
    const uid = req.query.uid;
    const result = await db.ratings.getRatings(uid);
    res.status(200).send(result)
}

async function getUserRating(req, res){
    const uid = req.query.uid;
    const rating = await db.ratings.getRatings(uid);
    const comments = await db.ratings.getComments(uid);
    const user = await db.users.getUserContactInfo(uid);
    const result = {
        rating : rating,
        comments: comments,
        firstName : user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber
    }
    res.status(200).send(result)
}

export const Ratings = {
    insertRate: insertRate,
    getComments: getComments,
    getRatings : getRatings,
    getUserRating: getUserRating
    
}