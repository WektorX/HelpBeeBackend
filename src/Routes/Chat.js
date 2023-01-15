import { controller } from '../Controller/Controller.js';

export function Chat(app){
    


    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });



    // =========================== POST =========================== //

    app.post(
        "/api/chat/initChat",
        controller.chat.initChat
    );

    app.post(
        "/api/chat/sendMsg",
        controller.chat.sendMsg
    );

    // =========================== GET =========================== //

    app.get(
        "/api/chat/getMessages",
        controller.chat.getMessages
    );

    // =========================== PUT =========================== //



    // =========================== DELETE =========================== //


    

}