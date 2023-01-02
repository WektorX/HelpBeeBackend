import {db} from '../Database/DB.js';
import fs from 'firebase-admin';

const Firestore = fs.firestore;
async function getUserOffers(req, res){
    const uid = req.query.uid;
    const userData = await db.offers.getUserOffers(uid);
    res.status(200).send({data : userData})
}


async function getOfferssFromCategory(req, res){
    const category = req.query.category;
    const offers = await db.offers.getOfferssFromCategory(category);
    res.status(200).send({offers})
}

async function insertOffer(req, res){

    let reqObj = req.body;
    let dateParts = reqObj.serviceDate.split("-");
    const offer = {
        serviceDate: new Date(+dateParts[0], parseInt(dateParts[1]) - 1, +dateParts[2],1,0,0),
        location : new Firestore.GeoPoint(reqObj.location.latitude,reqObj.location.longitude),
        description: reqObj.description,
        title: reqObj.title,
        category: reqObj.category,
        publicationDate: new Date(),
        userID: reqObj.uid,
        status: 0,
    };
    const result = await db.offers.insertOffer(offer)
    res.status(200).send({message: result})

}



export const Offers = {
    getUserOffers: getUserOffers,
    getOfferssFromCategory: getOfferssFromCategory,
    insertOffer : insertOffer
}