import {db} from '../Database/DB.js';
import fs from 'firebase-admin';
import sendEmail from '../Email/Email.js';

const Firestore = fs.firestore;

async function checkIfBlocked(req, res){
    const uid = req.query.uid;
    const blocked = await db.users.checkIfBlocked(uid);
    res.status(200).send({blocked : blocked})
}

async function getUserDataByUID(req, res){
    const uid = req.query.uid;
    const userData = await db.users.getUserDataByUID(uid);
    res.status(200).send({data : userData})
}

async function getUserContactInfo(req, res){
    const uid = req.query.uid;
    const userData = await db.users.getUserContactInfo(uid);
    res.status(200).send(userData)
}

async function fillInUserData(req, res){
    let dateParts = req.body.birthDate.split(".");
    const id = req.body.uid;
    const user = {
        birthDate: new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0],1,0,0),
        firstName: req.body.firstName.trim(),
        lastName: req.body.lastName.trim(),
        phoneNumber: req.body.phoneNumber,
        addressID: "",
        description: "",
        location : new Firestore.GeoPoint(0,0),
        email: req.body.email,
        userType: 'normal',
        distance: 0,
        preferences: [],
        blocked: false
    };
    const result = await db.users.fillInUserData(id, user)
    res.status(200).send({message: result})
}


async function checkIfUserFilledBasicData(req, res){
    const id = req.query.uid;
    const result = await db.users.checkIfUserFilledBasicData(id);
    res.status(200).send(result);
}

async function setUserLocation(req, res){
    var location = new Firestore.GeoPoint(req.body.location.Latitude, req.body.location.Longitude);
    const id = req.body.uid;
    const result = await db.users.setUserLocation(id, location)
    res.status(200).send({message: result})
}

async function setPermissions(req, res){
    const uid = req.body.uid;
    const userType = req.body.userType;
    const blocked = req.body.blocked
    const result = await db.users.setPermissions(uid, userType, blocked)
    if(result == true){
        const userContact = await db.users.getUserContactInfo(uid);
        let text = "Twoje konto zostało " + (blocked ? 'zablokowane' : 'odblokowane')+ ". W razie pytań proszę skontakuj się z nami odpowiadając na ten email."
        let subject = blocked ? 'Blokada konta' : 'Konto odblokowane'
        sendEmail(userContact.email, subject, text)
    }
    res.status(200).send({message: result})
}

async function setPreferences(req, res){
    const uid = req.body.uid;
    const distance = req.body.distance;
    const preferences = req.body.preferences;
    const result = await db.users.setPreferences(uid, distance, preferences)
    res.status(200).send({message: result})
}

async function getUserType(req, res) {
    const id = req.query.uid;
    const result = await db.users.getUserType(id)
    res.status(200).send({userType: result})
}

async function getAllUsers(req, res) {
    const result = await db.users.getAllUsers()
    res.status(200).send(result)
}

async function blockUser(req, res){
    const uid = req.body.uid;
    const block = req.body.block;
    const result = await db.users.blockUser(uid, block);
    res.status(200).send({message: result})
}

export const Users = {
    getUserDataByUID: getUserDataByUID,
    fillInUserData: fillInUserData,
    checkIfUserFilledBasicData: checkIfUserFilledBasicData,
    setUserLocation : setUserLocation,
    getUserContactInfo:getUserContactInfo,
    getUserType: getUserType,
    getAllUsers: getAllUsers,
    setPreferences: setPreferences,
    setPermissions : setPermissions,
    checkIfBlocked: checkIfBlocked,
    blockUser: blockUser
    
}