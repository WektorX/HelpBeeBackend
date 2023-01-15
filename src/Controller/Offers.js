import { db } from '../Database/DB.js';
import fs from 'firebase-admin';
import sendEmail from '../Email/Email.js';

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
    if(categories != undefined && distance > 0  && location != undefined && uid != ''){
        offers = await db.offers.getNewOffers(uid, distance, location, categories, date);
        res.status(200).send({ data: offers })
    }
    else{
        res.status(200).send({data: []})
    }
}

async function insertOffer(req, res) {

    let reqObj = req.body;
    let dateParts = reqObj.serviceDate.split("-");
    const offer = {
        serviceDate: new Date(+dateParts[0], parseInt(dateParts[1]) - 1, +dateParts[2], 1, 0, 0),
        location: new Firestore.GeoPoint(reqObj.location.latitude, reqObj.location.longitude),
        description: reqObj.description,
        title: reqObj.title.trim(),
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
        reviewed: false,
        type: reqObj.type,
        inReturn:  reqObj.inReturn
    };
    const result = await db.offers.insertOffer(offer)
    res.status(200).send({ message: result })

}

async function deleteOffer(req, res) {
    const docID = req.body.id;
    const title = req.body.title;
    let workerID = req.body.workerID;
    let userID = req.body.userID;
    const result = await db.offers.deleteOffer(docID);
    if(result == true){
        const userContact = await db.users.getUserContactInfo(userID)
        const workerContact = await db.users.getUserContactInfo(workerID);
        let text = "Użytkownik " + userContact.firstName + " " + userContact.lastName.charAt(0) + ". usunął ofertę <b>\"" + title +"\"</b>, którą obserwowałeś."
        sendEmail(workerContact.email, title , text)
    }
    res.status(200).send({ message: result });
}

async function withdrawOffer(req, res) {
    const docID = req.body.id;
    const title = req.body.title;
    let workerID = req.body.workerID;
    let userID = req.body.userID;
    const result = await db.offers.withdrawOffer(docID, workerID);
    if(result == true && workerID != ""){
        const userContact = await db.users.getUserContactInfo(userID)
        const workerContact = await db.users.getUserContactInfo(workerID);
        let text = "Użytkownik " + userContact.firstName + " " + userContact.lastName.charAt(0) + ". wycofał ofertę <b>\"" + title +"\"</b>, którą obserwowałeś."
        sendEmail(workerContact.email, title , text)
    }
    res.status(200).send({ message: result });
}

async function restoreOffer(req, res) {
    const docID = req.body.id;
    const result = await db.offers.restoreOffer(docID);
    res.status(200).send({ message: result });
}
async function closeOffer(req, res) {
    const docID = req.body.id;
    const title = req.body.title;
    let workerID = req.body.workerID;
    let userID = req.body.userID;
    const result = await db.offers.closeOffer(docID);
    if(result == true){
        const userContact = await db.users.getUserContactInfo(userID)
        const workerContact = await db.users.getUserContactInfo(workerID);
        let text = "Użytkownik " + userContact.firstName + " " + userContact.lastName.charAt(0) + ". zakończył ofertę <b>\"" + title +"\"</b>, którą obserwowałeś."
        sendEmail(workerContact.email, title , text)
    }
    res.status(200).send({ message: result });
}

async function updateOffer(req, res) {
    const docID = req.body.id;
    let reqOffer = req.body.offer;
    let dateParts = reqOffer.serviceDate.split("-");
    let workerID = req.body.worker;
    let userID = req.body.userID;
    const offer = {
        serviceDate: new Date(+dateParts[0], parseInt(dateParts[1]) - 1, +dateParts[2], 1, 0, 0),
        location: new Firestore.GeoPoint(reqOffer.location.latitude, reqOffer.location.longitude),
        description: reqOffer.description,
        title: reqOffer.title.trim(),
        category: reqOffer.category,
        status: reqOffer.status,
        reward: reqOffer.reward,
        type: reqOffer.type,
        inReturn: reqOffer.inReturn
    };
    const result = await db.offers.updateOffer(docID, offer);
    if(result == true && workerID != ''){
        const userContact = await db.users.getUserContactInfo(userID)
        const workerContact = await db.users.getUserContactInfo(workerID);
        let text = "Użytkownik " + userContact.firstName + " " + userContact.lastName.charAt(0) + ". zaktualizował dane ofertę <b>\"" + reqOffer.title.trim() +"\"</b>, którą obserwujesz."
        sendEmail(workerContact.email, reqOffer.title.trim(), text)
    }
    res.status(200).send({ message: result });

}


async function takeOffer(req, res){
    const workerID = req.body.workerID;
    const offerID = req.body.offerID
    const userID = req.body.userID;
    const title = req.body.title
    const result = await db.offers.takeOffer(workerID, offerID);
    if(result == true){
        const userContact = await db.users.getUserContactInfo(userID)
        const workerContact = await db.users.getUserContactInfo(workerID);
        let text = "Użytkownik " + workerContact.firstName + " " + workerContact.lastName.charAt(0) + ". złożył propozycję wykonania twojej oferty <b>\"" + title +"\"</b>."
        sendEmail(userContact.email, title, text)
    }
    res.status(200).send({ message: result });
}

async function resignFromOffer(req, res){
    const workerID = req.body.workerID;
    const offerID = req.body.offerID
    const userID = req.body.userID;
    const title = req.body.title
    const result = await db.offers.resignFromOffer(workerID, offerID);
    if(result == true){
        const userContact = await db.users.getUserContactInfo(userID)
        const workerContact = await db.users.getUserContactInfo(workerID);
        let text = "Użytkownik " + workerContact.firstName + " " + workerContact.lastName.charAt(0) + ". zrezygnował z wykonania twojej oferty <b>\"" + title +"\"</b>."
        sendEmail(userContact.email, title, text)
    }
    res.status(200).send({ message: result });
}

async function acceptWorker(req, res){
    const offerID = req.body.offerID
    const workerID = req.body.workerID;
    const title = req.body.title;
    const userID = req.body.userID;
    const result = await db.offers.acceptWorker(offerID);
    if(result == true){
        const userContact = await db.users.getUserContactInfo(userID)
        const workerContact = await db.users.getUserContactInfo(workerID);
        let text = "Użytkownik " + userContact.firstName + " " + userContact.lastName.charAt(0) + ". zatwierdził twoje zgłoszenie do oferty <b>\"" + title +"\"</b>."
        sendEmail(workerContact.email, title, text)
    }
    res.status(200).send({ message: result });
}

async function rejectWorker(req, res){
    const offerID = req.body.offerID
    const workerID = req.body.workerID;
    const title = req.body.title;
    const userID = req.body.userID;
    const result = await db.offers.rejectWorker(offerID, workerID);
    if(result == true){
        const userContact = await db.users.getUserContactInfo(userID)
        const workerContact = await db.users.getUserContactInfo(workerID);
        let text = "Użytkownik " + userContact.firstName + " " + userContact.lastName.charAt(0) + ". odrzucił twoje zgłoszenie do oferty <b>\"" + title +"\"</b>."
        sendEmail(workerContact.email, title, text)
    }
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
    if(result){
        const userID = req.body.userID;
        const userContact = await db.users.getUserContactInfo(userID);
        const title = req.body.title;
        let subject = blocked? "Zablokowana oferta" : "Oferta odblokowana"
        let blockedOffer = "Twoja oferta <b>\"" + title + "\"</b> została zablokowana. Zawiera ona wulgaryzmy lub treści łamiące regulamin aplikcaji. Aby, odblokować ofertę odpowiedz na tego maila!";
        let unblockedOffer = "Twoja oferta <b>\"" + title + "\"</b> została odblokowana."
        let text = blocked ? blockedOffer : unblockedOffer;
        sendEmail(userContact.email, subject, text);
        const worker = req.body.worker;
        if(worker !== ""){
            const workerContact = await db.users.getUserContactInfo(worker);
            blockedOffer = "Oferta, którą obserwujesz <b>\"" + title + "\"</b> została zablokowana. Przepraszamy za niedogodności.";
            unblockedOffer = "Oferta <b>\"" + title + "\"<b>została odblokowana."
            text = blocked ? blockedOffer : unblockedOffer;
            sendEmail(workerContact.email, subject, text)
        }

    }
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
    getNewOffers : getNewOffers,
}