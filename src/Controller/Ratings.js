import {db} from '../Database/DB.js';
import fs from 'firebase-admin';

const Firestore = fs.firestore;

async function insertRate(req, res){
    const rating = req.body.rating;
    const result = await db.ratings.insertRate(rating);
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
        lastName: user.lastName
    }
    console.log(result)
    res.status(200).send(result)
}

export const Ratings = {
    insertRate: insertRate,
    getComments: getComments,
    getRatings : getRatings,
    getUserRating: getUserRating
    
}