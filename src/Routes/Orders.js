import { controller } from '../Controller/Controller.js';

export function Orders(app){
    


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
        "/api/orders/getUserOrders",
        controller.orders.getUserOrders
    );

    // =========================== PUT =========================== //



    // =========================== DELETE =========================== //



}