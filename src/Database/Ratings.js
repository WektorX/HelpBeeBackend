import { common } from "./Common.js";
import fs from 'firebase-admin';
const collectionName = 'rating';
import { Users } from './Users.js'


async function insertRate(rating) {
    try {
        var result;
        const collection = common.db.collection(collectionName);
        result = await collection.doc().set(rating);
        return true;

    } catch (error) {
        console.log(error)
        return false
    }
}

async function getComments(uid) {
    try {
        const response = [];
        const collection = common.db.collection(collectionName);
        const query = await collection.where("workerID", "==", uid)
        .where("comment", "!=", "")
        .where("who", "==", "employer")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let comment = {};
                comment.comment = doc.data().comment;
                comment.person = doc.data().employerID;
                comment.who = doc.data().who;
                response.push(comment)
            })
        })

        const query2 = await collection.where("employerID", "==", uid)
        .where("comment", "!=", "")
        .where("who", "==", "worker")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let comment = {};
                comment.comment = doc.data().comment;
                comment.person = doc.data().workerID;
                comment.who = doc.data().who;
                response.push(comment)
            })
        })


        for (let i = 0; i < response.length; i++) {
            const employerInfo = await Users.getUserContactInfo(response[i].person);
            response[i].employerFirstName = employerInfo.firstName;
            response[i].employerLastName = employerInfo.lastName;
        }
        return response;
    }
    catch (e) {
        console.log(e)
    }
}


async function getRatingInfo(id, who) {
    try {
        let rating = -1;
        const collection = common.db.collection(collectionName);
        const query = await collection.where("offerID", "==", id)
        .where("who", "==", who)
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
        .where("who", "==", "employer")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                sum += doc.data().rating;
                numberOfRatings += 1;
            })
        })

        const query2 = await collection.where("employerID", "==", uid)
        .where("who", "==", "worker")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                sum += doc.data().rating;
                numberOfRatings += 1;
            })
        })

        let rating = 0;
        if(numberOfRatings > 0)
        rating = (sum / numberOfRatings).toFixed(2);
        return rating;
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