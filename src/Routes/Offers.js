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

    app.post(
        "/api/offers/insertOffer",
        controller.offers.insertOffer
    );

    app.post(
        "/api/offers/withdrawOffer",
        controller.offers.withdrawOffer
    );

    app.post(
        "/api/offers/closeOffer",
        controller.offers.closeOffer
    );

    app.post(
        "/api/offers/updateOffer",
        controller.offers.updateOffer
    );
    
    
    app.post(
        "/api/offers/takeOffer",
        controller.offers.takeOffer
    );

    app.post(
        "/api/offers/resignFromOffer",
        controller.offers.resignFromOffer
    );

    app.post(
        "/api/offers/acceptWorker",
        controller.offers.acceptWorker
    );

    app.post(
        "/api/offers/rejectWorker",
        controller.offers.rejectWorker
    );
    // =========================== GET =========================== //

    app.get(
        "/api/offers/getUserOffers",
        controller.offers.getUserOffers
    );

    app.get(
        "/api/offers/getOffersByCategory",
        controller.offers.getOffersByCategory
    );

    // =========================== PUT =========================== //



    // =========================== DELETE =========================== //

    app.delete(
        "/api/offers/deleteOffer",
        controller.offers.deleteOffer
    );

    

}