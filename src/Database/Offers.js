import { common } from "./Common.js";
import fs from 'firebase-admin';
const collectionName = 'offers';

async function getUserOffers(uid){
    try{
        let response = [];
        const collection = common.db.collection(collectionName);
        const query = await collection.where('userID' , '==' , uid)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) =>{
                let temp = doc.data();
                temp.serviceDate = new fs.firestore.Timestamp(temp.serviceDate._seconds, temp.serviceDate._nanoseconds).toDate();
                temp.id = doc.id;
                response.push(temp)
            })
        })
        return response;
    }
    catch(e){
        console.log(e)
    }
}

async function getOfferssFromCategory(category){
    try{
        let response = [];
        const collection = common.db.collection(collectionName);
        const query = await collection.where('category' , '==' , category)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) =>{
                response.push(doc.data())
            })
        })
        return response;
    }
    catch(e){
        console.log(e)
    }
}

async function insertOffer(offer){
    try {
        var result;
        const collection = common.db.collection(collectionName);
        result = await collection.doc().set(offer);
        console.log(result)
        return result;

    } catch (error) {
        console.log(error)
        return error
    }
}

async function deleteOffer(id){
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


async function withdrawOffer(id){
    try {
        var result;
        const collection = common.db.collection(collectionName);
        result = await collection.doc(id).update({status : 2});
        return result;

    } catch (error) {
        console.log(error)
        return error
    }
}

async function updateOffer(id, offer){
    console.log(id, offer)
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



export const Offers = {
    getUserOffers: getUserOffers,
    getOfferssFromCategory : getOfferssFromCategory,
    insertOffer: insertOffer,
    deleteOffer: deleteOffer,
    withdrawOffer: withdrawOffer,
    updateOffer: updateOffer
}