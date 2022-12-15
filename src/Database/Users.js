import { common } from "./Common.js";

const collectionName = 'users';

async function getUserData(uid) {
    try {
        let response = [];
        const collection = common.db.collection(collectionName);
        const query = await collection.where('userID', '==', uid)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    response.push(doc.data())
                })
            })
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
    getUserData: getUserData,
    fillInUserData: fillInUserData,
    checkIfUserFilledBasicData: checkIfUserFilledBasicData
}