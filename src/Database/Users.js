import { common } from "./Common.js";
import fs from 'firebase-admin';
const collectionName = 'users';

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

async function checkIfUserFilledBasicData(id) {
    console.log(id)
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



export const Users = {
    getUserDataByUID: getUserDataByUID,
    fillInUserData: fillInUserData,
    checkIfUserFilledBasicData: checkIfUserFilledBasicData
}