import {controller} from '../Controller/Controller.js';

export function Authentication(app){
 
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

// =========================== POST =========================== //



// =========================== GET =========================== //

app.get(
    "/api/auth/przyklad",
    controller.authentication.przyklad
);


// =========================== PUT =========================== //



// =========================== DELETE =========================== //


}