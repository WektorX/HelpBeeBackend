import { common } from "./Common.js";
import fs from 'firebase-admin';
import geofire from 'geofire-common'
import { Users } from './Users.js'
import { Ratings } from "./Ratings.js";
const collectionName = 'offers';
const Firestore = fs.firestore;


async function getUserOffers(uid) {
    try {
        let response = [];
        const collection = common.db.collection(collectionName);
        const query = await collection.where('userID', '==', uid)
            .orderBy("serviceDate", 'desc')
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    let temp = doc.data();
                    temp.serviceDate = new Firestore.Timestamp(temp.serviceDate._seconds, temp.serviceDate._nanoseconds).toDate();
                    temp.id = doc.id;
                    response.push(temp)
                })
            })
        for (let i = 0; i < response.length; i++) {
            if (response[i].worker != "") {
                const workerInfo = await Users.getUserContactInfo(response[i].worker);
                response[i].workerFirstName = workerInfo.firstName;
                response[i].workerLastName = workerInfo.lastName;
                response[i].workerPhone = workerInfo.phoneNumber;
                if (response[i].status == 3) {
                    const rating = await Ratings.getRatingInfo(response[i].id, "employer");
                    response[i].rating = rating;
                }
            }
        }
        return response;
    }
    catch (e) {
        console.log(e)
    }
}



async function getUserJobs(uid) {
    try {
        let response = [];
        const collection = common.db.collection(collectionName);
        const query = await collection.where('worker', '==', uid)
            .orderBy("serviceDate")
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    let temp = doc.data();
                    temp.serviceDate = new Firestore.Timestamp(temp.serviceDate._seconds, temp.serviceDate._nanoseconds).toDate();
                    temp.id = doc.id;
                    response.push(temp)
                })
            })
        for (let i = 0; i < response.length; i++) {
            const employerInfo = await Users.getUserContactInfo(response[i].userID);
            response[i].employerFirstName = employerInfo.firstName;
            response[i].employerLastName = employerInfo.lastName;
            response[i].employerPhone = employerInfo.phoneNumber;
            if (response[i].status == 3) {
                const rating = await Ratings.getRatingInfo(response[i].id, "worker");
                response[i].rating = rating;
            }
        }
        return response;
    }
    catch (e) {
        console.log(e)
    }
}



async function getOffersByCategory(category, location, distance, uid) {
    try {
        let response = [];
        const userLocation = new Firestore.GeoPoint(parseFloat(location.Latitude), parseFloat(location.Longitude));
        const collection = common.db.collection(collectionName);
        const query = await collection.where('category', '==', category)
            .where('status', '==', 0)
            .where('blocked', '==', false)
            .orderBy("serviceDate")
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    let temp = doc.data();
                    temp.serviceDate = new Firestore.Timestamp(temp.serviceDate._seconds, temp.serviceDate._nanoseconds).toDate();
                    temp.id = doc.id;
                    let offerLocation = new Firestore.GeoPoint(temp.location._latitude, temp.location._longitude)
                    let distanceInKM = geofire.distanceBetween([userLocation.latitude, userLocation.longitude], [offerLocation.latitude, offerLocation.longitude]);
                    if (distanceInKM <= distance && temp.userID != uid)
                        response.push(temp)

                })
            })
        return response;
    }
    catch (e) {
        console.log(e)
    }
}


async function getNewOffers(uid, distance, location, categories, date) {
    try {
        let response = [];
        let minuteAgo = new Date(date.valueOf() - 10000);
        const userLocation = new Firestore.GeoPoint(parseFloat(location.Latitude), parseFloat(location.Longitude));
        const collection = common.db.collection(collectionName);
        const query = await collection.where('category', 'in', categories)
            .where('status', '==', 0)
            .where('blocked', '==', false)
            .where("publicationDate", ">=", minuteAgo)
            .where('publicationDate', "<=", date)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    let temp = doc.data();
                    let offerLocation = new Firestore.GeoPoint(temp.location._latitude, temp.location._longitude)
                    let distanceInKM = geofire.distanceBetween([userLocation.latitude, userLocation.longitude], [offerLocation.latitude, offerLocation.longitude]);
                    if (distanceInKM <= distance && temp.userID != uid)
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
        return true;

    } catch (error) {
        console.log(error)
        return false
    }
}


async function withdrawOffer(id, workerID) {
    try {
        let update = {
            status: 2,
            workerStatus: "rejected",
            worker: '',
        }
        if(workerID !== '')
            update.workersHistory = Firestore.FieldValue.arrayUnion(workerID);
        var result;
        const collection = common.db.collection(collectionName);
        result = await collection.doc(id).update(update);
        return true;

    } catch (error) {
        console.log(error)
        return false
    }
}


async function restoreOffer(id) {
    try {
        let update = {
            status: 0,
            workerStatus: "none",
            workersHistory: [],
            blocked: false,
            reviewed: false,
            reportedBy: [],
            worker: "",
            publicationDate: new Date(),

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
        return true;

    } catch (error) {
        console.log(error)
        return false
    }
}

async function updateOffer(id, offer) {
    try {
        var result;
        const collection = common.db.collection(collectionName);
        result = await collection.doc(id).update(offer);
        return true;

    } catch (error) {
        console.log(error)
        return false
    }
}

async function takeOffer(uid, offerID) {
    try {
        var result;
        let update = {
            status: 1,
            worker: uid,
            workerStatus: "requested"
        }
        const collection = common.db.collection(collectionName);
        result = await collection.doc(offerID).update(update);
        return true;

    } catch (error) {
        console.log(error)
        return false
    }
}

async function resignFromOffer(uid, offerID) {
    try {
        var result;
        let update = {
            status: 0,
            worker: "",
            workersHistory: Firestore.FieldValue.arrayUnion(uid),
            workerStatus: "resign",
        }
        const collection = common.db.collection(collectionName);
        result = await collection.doc(offerID).update(update);
        return true;

    } catch (error) {
        console.log(error)
        return false
    }
}



async function acceptWorker(offerID) {
    try {
        var result;
        let update = {
            workerStatus: "accepted",
        }
        const collection = common.db.collection(collectionName);
        result = await collection.doc(offerID).update(update);
        return true;

    } catch (error) {
        console.log(error)
        return false
    }
}


async function rejectWorker(offerID, workerID) {
    try {
        var result;
        let update = {
            status: 0,
            worker: "",
            workersHistory: Firestore.FieldValue.arrayUnion(workerID),
            workerStatus: "rejected",
        }
        const collection = common.db.collection(collectionName);
        result = await collection.doc(offerID).update(update);
        return true;

    } catch (error) {
        console.log(error)
        return false
    }
}


async function reportOffer(offerID, userID) {
    try {
        var result;
        let update = {
            reportedBy: Firestore.FieldValue.arrayUnion(userID),
        }
        const collection = common.db.collection(collectionName);
        result = await collection.doc(offerID).update(update);
        return result;

    } catch (error) {
        console.log(error)
        return error
    }
}

async function setBlockOffer(id, blocked) {
    try {
        var result;
        let update = {
            blocked: blocked,
            reviewed: true
        }
        const collection = common.db.collection(collectionName);
        result = await collection.doc(id).update(update);
        return true;

    } catch (error) {
        console.log(error)
        return false
    }
}

async function setReviewedOffer(id, blocked) {
    try {
        var result;
        let update = {
            reviewed: true
        }
        const collection = common.db.collection(collectionName);
        result = await collection.doc(id).update(update);
        return result;

    } catch (error) {
        console.log(error)
        return error
    }
}


async function getReportedOffers() {
    try {
        let response = [];
        const collection = common.db.collection(collectionName);
        const query = await collection.where('reportedBy', '!=', [])
            .where("reviewed", '==', false)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    let temp = doc.data();
                    temp.serviceDate = new Firestore.Timestamp(temp.serviceDate._seconds, temp.serviceDate._nanoseconds).toDate();
                    temp.publicationDate = new Firestore.Timestamp(temp.publicationDate._seconds, temp.publicationDate._nanoseconds).toDate();
                    temp.id = doc.id;
                    response.push(temp)

                })
            })

        for (let i = 0; i < response.length; i++) {
            const userInfo = await Users.getUserContactInfo(response[i].userID);
            response[i].firstName = userInfo.firstName;
            response[i].lastName = userInfo.lastName;
        }
        return response;
    }
    catch (e) {
        console.log(e)
    }
}


async function getBlockedOffers() {
    try {
        let response = [];
        const collection = common.db.collection(collectionName);
        const query = await collection.where("blocked", '==', true)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    let temp = doc.data();
                    temp.serviceDate = new Firestore.Timestamp(temp.serviceDate._seconds, temp.serviceDate._nanoseconds).toDate();
                    temp.publicationDate = new Firestore.Timestamp(temp.publicationDate._seconds, temp.publicationDate._nanoseconds).toDate();
                    temp.id = doc.id;
                    response.push(temp)

                })
            })

        for (let i = 0; i < response.length; i++) {
            const userInfo = await Users.getUserContactInfo(response[i].userID);
            response[i].firstName = userInfo.firstName;
            response[i].lastName = userInfo.lastName;
        }
        return response;
    }
    catch (e) {
        console.log(e)
    }
}


async function getAllOffers() {
    try {
        let response = [];
        const collection = common.db.collection(collectionName);
        const query = await collection.where('userID', '!=', "")
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    let temp = doc.data();
                    temp.serviceDate = new Firestore.Timestamp(temp.serviceDate._seconds, temp.serviceDate._nanoseconds).toDate();
                    temp.publicationDate = new Firestore.Timestamp(temp.publicationDate._seconds, temp.publicationDate._nanoseconds).toDate();
                    temp.id = doc.id;
                    response.push(temp)

                })
            })

        for (let i = 0; i < response.length; i++) {
            const userInfo = await Users.getUserContactInfo(response[i].userID);
            response[i].firstName = userInfo.firstName;
            response[i].lastName = userInfo.lastName;
        }
        return response;
    }
    catch (e) {
        console.log(e)
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
    closeOffer: closeOffer,
    getUserJobs: getUserJobs,
    reportOffer: reportOffer,
    getReportedOffers: getReportedOffers,
    getBlockedOffers: getBlockedOffers,
    getAllOffers: getAllOffers,
    restoreOffer: restoreOffer,
    setBlockOffer: setBlockOffer,
    setReviewedOffer :setReviewedOffer,
    getNewOffers :getNewOffers
}