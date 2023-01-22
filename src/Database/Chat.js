import { common } from "./Common.js";
import fs from 'firebase-admin';
const collectionName = 'chat';
import { Users } from './Users.js'
const Firestore = fs.firestore;


async function initChat(employerID, workerID, offerID) {
    try {
        var exist = false;
        const collection = common.db.collection(collectionName);
        const query = await collection.where("employerID", "==", employerID)
            .where("workerID", "==", workerID)
            .where("offerID", "==", offerID)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    exist = true;
                })
            })

        if (!exist) {
            let chat = {
                offerID: offerID,
                workerID: workerID,
                employerID: employerID,
                chat: []
            }
            await collection.doc().set(chat);
        }
        return true;

    } catch (error) {
        console.log(error)
        return false
    }
}



async function sendMsg(employerID, workerID, offerID, msg) {
    try {
        var result;
        var id = '';

        const collection = common.db.collection(collectionName);
        const query = await collection.where("employerID", "==", employerID)
            .where("workerID", "==", workerID)
            .where("offerID", "==", offerID)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    id = doc.id;
                })
            })
        if (id != '') {
            let update = {
                chat: Firestore.FieldValue.arrayUnion(msg)
            }
            result = await collection.doc(id).update(update);
        }
        else {
            result = { error: 'No such conversation' }
        }
        return true;

    } catch (error) {
        console.log(error)
        return false
    }
}

async function getMessages(employerID, workerID, offerID) {
    try {
        var response = null;
        const collection = common.db.collection(collectionName);
        const query = await collection.where("employerID", "==", employerID)
            .where("workerID", "==", workerID)
            .where("offerID", "==", offerID)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    response = doc.data();
                })
            })
        return response;
    }
    catch (e) {
        console.log(e)
    }
}



export const Chat = {
    initChat: initChat,
    sendMsg: sendMsg,
    getMessages: getMessages
}