import { controller } from '../Controller/Controller.js';

export function Ratings(app){
    

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });



    // =========================== POST =========================== //

    app.post(
        "/api/ratings/insertRate",
        controller.ratings.insertRate
    );

    // =========================== GET =========================== //

    app.get(
        "/api/ratings/getComments",
        controller.ratings.getComments
    );

    app.get(
        "/api/ratings/getRatings",
        controller.ratings.getRatings
    );

    app.get(
        "/api/ratings/getUserRating",
        controller.ratings.getUserRating
    );

    // app.get(
    //     "/api/offers/getRatingsFromCategory",
    //     controller.ratings.getComments
    // );
    // =========================== PUT =========================== //



    // =========================== DELETE =========================== //

}