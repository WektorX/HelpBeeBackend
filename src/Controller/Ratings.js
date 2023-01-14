import {db} from '../Database/DB.js';
import fs from 'firebase-admin';
import sendEmail from '../Email/Email.js';


async function insertRate(req, res){
    const rating = req.body.rating;
    let workerID = rating.workerID;
    let employerID = rating.employerID;
    let rate = rating.rating;
    let comment = rating.comment;
    let who = rating.who;
    const result = await db.ratings.insertRate(rating);
    if(result == true){
        const employerContact = await db.users.getUserContactInfo(employerID)
        const workerContact = await db.users.getUserContactInfo(workerID);
        let text = '';
        if(who == 'employer')
        {
            text = "Użytkownik " + employerContact.firstName + " " + employerContact.lastName.charAt(0) + ". wystawił ci ocenę " + rate.toFixed(1) +".";
        }
        else{
            text = "Użytkownik " + workerContact.firstName + " " + workerContact.lastName.charAt(0) + ". wystawił ci ocenę " + rate.toFixed(1) +".";
        }
        if(comment != ''){
            text += 'Dodał także komentarz \"' + comment + "\".";
        } 
        let email = (who == 'employer' ? workerContact.email : employerContact.email);
        console.log(who, email)
        sendEmail(email, "Nowa ocena", text)
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