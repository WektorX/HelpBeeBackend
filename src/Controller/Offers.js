import { db } from '../Database/DB.js';
import fs from 'firebase-admin';

const Firestore = fs.firestore;

async function getUserOffers(req, res) {
    const uid = req.query.uid;
    const userData = await db.offers.getUserOffers(uid);
    res.status(200).send({ data: userData })
}

async function getUserJobs(req, res){
    const uid = req.query.uid;
    const userData = await db.offers.getUserJobs(uid);
    res.status(200).send({ data: userData })
}


async function getOffersByCategory(req, res) {
    const category = req.query.category;
    const location = req.query.location;
    const distance = req.query.distance;
    const offers = await db.offers.getOffersByCategory(category, location, distance);
    res.status(200).send({ offers })
}

async function insertOffer(req, res) {

    let reqObj = req.body;
    let dateParts = reqObj.serviceDate.split("-");
    const offer = {
        serviceDate: new Date(+dateParts[0], parseInt(dateParts[1]) - 1, +dateParts[2], 1, 0, 0),
        location: new Firestore.GeoPoint(reqObj.location.latitude, reqObj.location.longitude),
        description: reqObj.description,
        title: reqObj.title,
        category: reqObj.category,
        publicationDate: new Date(),
        userID: reqObj.uid,
        reward: reqObj.reward,
        worker: "",
        workerStatus: "none",
        workersHistory: [],
        status: 0,
    };
    const result = await db.offers.insertOffer(offer)
    res.status(200).send({ message: result })

}

async function deleteOffer(req, res) {
    const docID = req.body.id;
    const result = await db.offers.deleteOffer(docID);
    res.status(200).send({ message: result });
}

async function withdrawOffer(req, res) {
    const docID = req.body.id;
    const result = await db.offers.withdrawOffer(docID);
    res.status(200).send({ message: result });
}

async function closeOffer(req, res) {
    const docID = req.body.id;
    console.log(docID)
    const result = await db.offers.closeOffer(docID);
    res.status(200).send({ message: result });
}

async function updateOffer(req, res) {
    const docID = req.body.id;
    let reqOffer = req.body.offer;
    let dateParts = reqOffer.serviceDate.split("-");
    const offer = {
        serviceDate: new Date(+dateParts[0], parseInt(dateParts[1]) - 1, +dateParts[2], 1, 0, 0),
        location: new Firestore.GeoPoint(reqOffer.location.latitude, reqOffer.location.longitude),
        description: reqOffer.description,
        title: reqOffer.title,
        category: reqOffer.category,
        status: reqOffer.status,
        reward: reqOffer.reward,
    };
    const result = await db.offers.updateOffer(docID, offer);
    res.status(200).send({ message: result });

}


async function takeOffer(req, res){
    const userID = req.body.uid;
    const offerID = req.body.offerID
    const result = await db.offers.takeOffer(userID, offerID);
    res.status(200).send({ message: result });
}

async function resignFromOffer(req, res){
    const userID = req.body.uid;
    const offerID = req.body.offerID
    const result = await db.offers.resignFromOffer(userID, offerID);
    res.status(200).send({ message: result });
}

async function acceptWorker(req, res){
    const offerID = req.body.offerID
    const result = await db.offers.acceptWorker(offerID);
    res.status(200).send({ message: result });
}

async function rejectWorker(req, res){
    const offerID = req.body.offerID
    const workerID = req.body.workerID
    const result = await db.offers.rejectWorker(offerID, workerID);
    res.status(200).send({ message: result });
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
    closeOffer : closeOffer,
    getUserJobs: getUserJobs
}