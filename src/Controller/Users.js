import {db} from '../Database/DB.js';
import fs from 'firebase-admin';

const Firestore = fs.firestore();

async function getUserData(req, res){
    const uid = req.query.uid;
    const userData = await db.users.getUserData(uid);
    res.status(200).send({data : userData})
}

async function fillInUserData(req, res){
    console.log(req.body);
    let dateParts = req.body.birthDate.split(".");
    const id = req.body.uid;
    const user = {
        birthDate: new Date(dateParts[2], dateParts[1], dateParts[0]),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        addressID: "",
        description: "",
        location : [0,0], // TODO: set geopoint not an array
    };
    const result = await db.users.fillInUserData(id, user)
    res.status(200).send({message: result})
}

async function checkIfUserFilledBasicData(req, res){
    const id = req.query.uid;
    const result = await db.users.checkIfUserFilledBasicData(id);
    res.status(200).send(result);
}

export const Users = {
    getUserData: getUserData,
    fillInUserData: fillInUserData,
    checkIfUserFilledBasicData: checkIfUserFilledBasicData
    
}