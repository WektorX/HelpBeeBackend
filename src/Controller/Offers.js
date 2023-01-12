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
    const uid = req.query.uid;
    const offers = await db.offers.getOffersByCategory(category, location, distance, uid);
    res.status(200).send({ offers })
}



async function getNewOffers(req, res) {
    let date = new Date();
    const categories = req.query.categories;
    const uid = req.query.uid;
    const distance = req.query.distance;
    const location = req.query.location;
    let offers = [];
    if(categories && distance && location && uid){
        offers = await db.offers.getNewOffers(uid, distance, location, categories, date);
    }
    res.status(200).send({ data: offers })
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
        reportedBy : [],
        status: 0,
        blocked: false,
        reviewed: false
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

async function restoreOffer(req, res) {
    const docID = req.body.id;
    const result = await db.offers.restoreOffer(docID);
    res.status(200).send({ message: result });
}
async function closeOffer(req, res) {
    const docID = req.body.id;
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

async function reportOffer(req, res){
    const offerID = req.body.offerID
    const userID = req.body.userID
    const result = await db.offers.reportOffer(offerID, userID);
    res.status(200).send({ message: result });
}

async function getReportedOffers(req, res) {
    const reported = await db.offers.getReportedOffers();
    res.status(200).send(reported)
}

async function getBlockedOffers(req, res) {
    const result = await db.offers.getBlockedOffers();
    res.status(200).send(result)
}

async function getAllOffers(req, res) {
    const result = await db.offers.getAllOffers();
    res.status(200).send(result)
}



async function setBlockOffer(req, res) {
    const id = req.body.id;
    const blocked = req.body.blocked;
    const result = await db.offers.setBlockOffer(id, blocked);
    res.status(200).send(result)
}

async function setReviewedOffer(req, res) {
    const id = req.body.id;
    const result = await db.offers.setReviewedOffer(id);
    res.status(200).send(result)
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
    getUserJobs: getUserJobs,
    reportOffer: reportOffer,
    getReportedOffers: getReportedOffers,
    getBlockedOffers: getBlockedOffers,
    getAllOffers: getAllOffers,
    restoreOffer: restoreOffer,
    setBlockOffer: setBlockOffer,
    setReviewedOffer: setReviewedOffer,
    getNewOffers : getNewOffers
}