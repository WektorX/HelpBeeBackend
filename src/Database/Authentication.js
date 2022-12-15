import { common } from "./Common.js";

const collectionName = 'auth';

async function przyklad(){
    try{
        let response = [];
        // const collection = common.db.collection(collectionName);
        // const query = await collection.where('firstName' , '==' , 'Wiktor')
        // .get()
        // .then((querySnapshot) => {
        //     querySnapshot.forEach((doc) =>{
        //         response.push(doc.data())
        //     })
        // })

        return response;
    }
    catch(e){
        console.log(e)
    }

}

export const Authentication = {
    przyklad: przyklad
}