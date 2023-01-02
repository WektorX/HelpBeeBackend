import { controller } from '../Controller/Controller.js';

export function Offers(app){
    


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
        "/api/offers/getUserOffers",
        controller.offers.getUserOffers
    );

    app.get(
        "/api/offers/getOfferssFromCategory",
        controller.offers.getOfferssFromCategory
    );

    // =========================== PUT =========================== //

    app.post(
        "/api/offers/insertOffer",
        controller.offers.insertOffer
    );

    // =========================== DELETE =========================== //



}