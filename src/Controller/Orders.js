import {db} from '../Database/DB.js';

async function getUserOrders(req, res){
    const uid = req.query.uid;
    const userData = await db.orders.getUserOrders(uid);
    res.status(200).send({data : userData})
}

export const Orders = {
    getUserOrders: getUserOrders,
}