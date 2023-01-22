import {db} from '../Database/DB.js';
import fs from 'firebase-admin';


async function initChat(req, res){
    let offerID = req.body.offerID;
    let workerID = req.body.workerID;
    let employerID = req.body.employerID;
    const result = await db.chat.initChat(employerID, workerID, offerID);
    res.status(200).send({message: result})
}

async function sendMsg(req, res){
    let offerID = req.body.offerID;
    let workerID = req.body.workerID;
    let employerID = req.body.employerID;
    let msg = req.body.msg;
    const result = await db.chat.sendMsg(employerID, workerID, offerID, msg);
    res.status(200).send({message: result})
}

async function getMessages(req, res){
    const employerID = req.query.employerID;
    const workerID = req.query.workerID;
    const offerID = req.query.offerID;
    const chat = await db.chat.getMessages(employerID, workerID, offerID);
    res.status(200).send(chat)

}

export const Chat = {
    initChat: initChat,
    sendMsg : sendMsg,
    getMessages: getMessages
}