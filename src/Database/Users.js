import { common } from "./Common.js";
import fs from 'firebase-admin';
const collectionName = 'users';


async function checkIfBlocked(uid){
    try {

        const collection = common.db.collection(collectionName);
        const query = await collection.doc(uid).get();
        const response = query.data().blocked;
        return response;
    }
    catch (e) {
        console.log(e)
    } 
}

async function getUserDataByUID(uid) {
    try {
       
        const collection = common.db.collection(collectionName);
        const query = await collection.doc(uid).get();
        const response = query.data();
        response.birthDate = new fs.firestore.Timestamp(response.birthDate._seconds, response.birthDate._nanoseconds).toDate();
        return response;
    }
    catch (e) {
        console.log(e)
    }
}


async function getUserContactInfo(uid) {
    try {
       
        const collection = common.db.collection(collectionName);
        const query = await collection.doc(uid).get();
        let contactInfo = {};
        if(query.data()) {
            contactInfo.firstName = query.data().firstName;
            contactInfo.lastName = query.data().lastName;
            contactInfo.phoneNumber = query.data().phoneNumber;
        }
        return contactInfo;
    }
    catch (e) {
        console.log(e)
    }
}


async function fillInUserData(id, user) {
    try {
        var result;
        const collection = common.db.collection(collectionName);
        result = await collection.doc(id).set(user);
        return result;

    } catch (error) {
        console.log(error)
        return error
    }
}

async function setUserLocation(id, location){
    try {
        var result;
        const collection = common.db.collection(collectionName);
        result = await collection.doc(id).update({"location" : location});
        return result;

    } catch (error) {
        console.log(error)
        return error
    } 
}


async function setPreferences(uid, distance, preferences){
    try {
        let update = {
            distance : distance,
            preferences: preferences
        }
        var result;
        const collection = common.db.collection(collectionName);
        result = await collection.doc(uid).update(update);
        return result;

    } catch (error) {
        console.log(error)
        return error
    } 
}

async function blockUser(uid, block){
    try {
        let update = {
            block : block,
        }
        var result;
        const collection = common.db.collection(collectionName);
        result = await collection.doc(uid).update(update);
        return result;

    } catch (error) {
        console.log(error)
        return error
    } 
}


async function setPermissions(uid, userType, blocked){
    try {
        let update = {
            userType : userType,
            blocked: blocked
        }
        var result;
        const collection = common.db.collection(collectionName);
        result = await collection.doc(uid).update(update);
        return result;

    } catch (error) {
        console.log(error)
        return error
    } 
}

async function checkIfUserFilledBasicData(id) {
    try {
        var result = {
            message: "User did not filled in!",
            filledIn: false,
        };
        const collection = common.db.collection(collectionName);
        await collection.doc(id).get()
            .then((querySnapshot) => {
                if (querySnapshot.exists) {
                    result.message = "User already filled in!";
                    result.filledIn = true;
                }
            })
        return result
    }
    catch (error) {
        return error;
    }
}

async function getUserType(uid) {
    try {
       
        const collection = common.db.collection(collectionName);
        const query = await collection.doc(uid).get();
        let userType = 'normal';
        if(query.data()) {
            userType = query.data().userType;
        }
        return userType;
    }
    catch (e) {
        console.log(e)
    }
}


async function getAllUsers() {
    try {
        let response = [];
        const collection = common.db.collection(collectionName);
        const query = await collection.where('firstName', '!=', "")
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    let temp = doc.data();
                    temp.id = doc.id;
                    response.push(temp)

                })
            })
        return response;
    }
    catch (e) {
        console.log(e)
    }
}

export const Users = {
    getUserDataByUID: getUserDataByUID,
    fillInUserData: fillInUserData,
    checkIfUserFilledBasicData: checkIfUserFilledBasicData,
    setUserLocation : setUserLocation,
    getUserContactInfo: getUserContactInfo,
    getUserType: getUserType,
    getAllUsers: getAllUsers,
    setPreferences: setPreferences,
    setPermissions: setPermissions,
    checkIfBlocked: checkIfBlocked,
    blockUser: blockUser
}