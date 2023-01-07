import { common } from "./Common.js";
import fs from 'firebase-admin';
import geofire from 'geofire-common'
import {Users} from './Users.js'
const collectionName = 'offers';
const Firestore = fs.firestore;


async function getUserOffers(uid) {
    try {
        let response = [];
        const collection = common.db.collection(collectionName);
        const query = await collection.where('userID', '==', uid)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    let temp = doc.data();
                    temp.serviceDate = new Firestore.Timestamp(temp.serviceDate._seconds, temp.serviceDate._nanoseconds).toDate();
                    temp.id = doc.id;
                    response.push(temp)
                })
            })
        for(let i =0; i < response.length; i++){
            if(response[i].worker != ""){
                const workerInfo = await Users.getUserContactInfo(response[i].worker);
                response[i].workerFirstName = workerInfo.firstName;
                response[i].workerLastName = workerInfo.lastName;
                response[i].workerPhone = workerInfo.phoneNumber;
            }
        }
        return response;
    }
    catch (e) {
        console.log(e)
    }
}

async function getOffersByCategory(category, location, distance) {
    try {
        let response = [];
        const userLocation = new Firestore.GeoPoint(parseFloat(location.Latitude), parseFloat(location.Longitude));
        const collection = common.db.collection(collectionName);
        const query = await collection.where('category', '==', category).where('status', '==', 0)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    let temp = doc.data();
                    temp.serviceDate = new Firestore.Timestamp(temp.serviceDate._seconds, temp.serviceDate._nanoseconds).toDate();
                    temp.id = doc.id;
                    let offerLocation = new Firestore.GeoPoint(temp.location._latitude, temp.location._longitude)
                    let distanceInKM = geofire.distanceBetween([userLocation.latitude, userLocation.longitude], [offerLocation.latitude, offerLocation.longitude]);
                    if (distanceInKM <= distance)
                        response.push(temp)

                })
            })
        return response;
    }
    catch (e) {
        console.log(e)
    }
}

async function insertOffer(offer) {
    try {
        var result;
        const collection = common.db.collection(collectionName);
        result = await collection.doc().set(offer);
        return result;

    } catch (error) {
        console.log(error)
        return error
    }
}

async function deleteOffer(id) {
    try {
        var result;
        const collection = common.db.collection(collectionName);
        result = await collection.doc(id).delete();
        return result;

    } catch (error) {
        console.log(error)
        return error
    }
}


async function withdrawOffer(id) {
    try {
        let update = {
            status: 2,
            workerStatus: "rejected",
        }
        var result;
        const collection = common.db.collection(collectionName);
        result = await collection.doc(id).update(update);
        return result;

    } catch (error) {
        console.log(error)
        return error
    }
}


async function closeOffer(id) {
    try {
        let update = {
            status: 3,
            workerStatus: "finished",
        }
        var result;
        const collection = common.db.collection(collectionName);
        result = await collection.doc(id).update(update);
        return result;

    } catch (error) {
        console.log(error)
        return error
    }
}

async function updateOffer(id, offer) {
    try {
        var result;
        const collection = common.db.collection(collectionName);
        result = await collection.doc(id).update(offer);
        return result;

    } catch (error) {
        console.log(error)
        return error
    }
}

async function takeOffer(uid, offerID){
    try {
        var result;
        let update = {
            status: 1,
            worker : uid,
            workerStatus: "requested"
        }
        const collection = common.db.collection(collectionName);
        result = await collection.doc(offerID).update(update);
        return result;

    } catch (error) {
        console.log(error)
        return error
    }
}

async function resignFromOffer(uid, offerID){
    try {
        var result;
        let update = {
            status: 0,
            worker : "",
            workersHistory: Firestore.FieldValue.arrayUnion(uid),
            workerStatus: "resign",
        }
        const collection = common.db.collection(collectionName);
        result = await collection.doc(offerID).update(update);
        return result;

    } catch (error) {
        console.log(error)
        return error
    }
}



async function acceptWorker(offerID){
    try {
        var result;
        let update = {
            workerStatus: "accepted",
        }
        const collection = common.db.collection(collectionName);
        result = await collection.doc(offerID).update(update);
        return result;

    } catch (error) {
        console.log(error)
        return error
    }
}


async function rejectWorker(offerID, workerID){
    try {
        var result;
        let update = {
            status: 0,
            worker : "",
            workersHistory: Firestore.FieldValue.arrayUnion(workerID),
            workerStatus: "rejected",
        }
        const collection = common.db.collection(collectionName);
        result = await collection.doc(offerID).update(update);
        return result;

    } catch (error) {
        console.log(error)
        return error
    }
}


export const Offers = {
    getUserOffers: getUserOffers,
    getOffersByCategory: getOffersByCategory,
    insertOffer: insertOffer,
    deleteOffer: deleteOffer,
    withdrawOffer: withdrawOffer,
    updateOffer: updateOffer,
    takeOffer: takeOffer,
    resignFromOffer: resignFromOffer,
    acceptWorker: acceptWorker,
    rejectWorker: rejectWorker,
    closeOffer: closeOffer
}