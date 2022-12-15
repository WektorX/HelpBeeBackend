import { common } from "./Common.js";

const collectionName = 'orders';

async function getUserOrders(uid){
    try{
        let response = [];
        const collection = common.db.collection(collectionName);
        const query = await collection.where('userID' , '==' , uid)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) =>{
                response.push(doc.data())
            })
        })
        console.log(response)
        return response;
    }
    catch(e){
        console.log(e)
    }

}

export const Orders = {
    getUserOrders: getUserOrders
}