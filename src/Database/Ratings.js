import { common } from "./Common.js";
import fs from 'firebase-admin';
const collectionName = 'rating';
import { Users } from './Users.js'


async function insertRate(rating) {
    try {
        var result;
        const collection = common.db.collection(collectionName);
        result = await collection.doc().set(rating);
        return result;

    } catch (error) {
        console.log(error)
        return error
    }
}

async function getComments(uid) {
    try {
        const response = [];
        const collection = common.db.collection(collectionName);
        const query = await collection.where("workerID", "==", uid)
        .where("comment", "!=", "")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let comment = {};
                comment.comment = doc.data().comment;
                comment.employerID = doc.data().employerID;
                response.push(comment)
            })
        })

        for (let i = 0; i < response.length; i++) {
            const employerInfo = await Users.getUserContactInfo(response[i].employerID);
            response[i].employerFirstName = employerInfo.firstName;
            response[i].employerLastName = employerInfo.lastName;
        }
        return response;
    }
    catch (e) {
        console.log(e)
    }
}


async function getRatingInfo(id) {
    try {
        let rating = -1;
        const collection = common.db.collection(collectionName);
        const query = await collection.where("offerID", "==", id)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                rating = doc.data().rating;
            })
        })
        return rating;
    }
    catch (e) {
        console.log(e)
    }
}


async function getRatings(uid) {
    try {
        let sum = 0;
        let numberOfRatings = 0;
        const collection = common.db.collection(collectionName);
        const query = await collection.where("workerID", "==", uid)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                sum += doc.data().rating;
                numberOfRatings += 1;
            })
        })
        return (sum / numberOfRatings).toFixed(2);
    }
    catch (e) {
        console.log(e)
    }
}

export const Ratings = {
    insertRate: insertRate,
    getComments: getComments,
    getRatingInfo:getRatingInfo,
    getRatings: getRatings
}