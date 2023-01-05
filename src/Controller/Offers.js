import { db } from '../Database/DB.js';
import fs from 'firebase-admin';

const Firestore = fs.firestore;
async function getUserOffers(req, res) {
    const uid = req.query.uid;
    const userData = await db.offers.getUserOffers(uid);
    res.status(200).send({ data: userData })
}


async function getOfferssFromCategory(req, res) {
    const category = req.query.category;
    const offers = await db.offers.getOfferssFromCategory(category);
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
    };
    const result = await db.offers.updateOffer(docID, offer);
    res.status(200).send({ message: result });

}


export const Offers = {
    getUserOffers: getUserOffers,
    getOfferssFromCategory: getOfferssFromCategory,
    insertOffer: insertOffer,
    deleteOffer: deleteOffer,
    withdrawOffer: withdrawOffer,
    updateOffer: updateOffer
}