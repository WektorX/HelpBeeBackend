import { controller } from '../Controller/Controller.js';

export function Users(app) {

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });



    // =========================== POST =========================== //

    app.post('/api/users/fillInUserData', controller.users.fillInUserData);

    app.post('/api/users/setUserLocation', controller.users.setUserLocation)

    // =========================== GET =========================== //

    app.get(
        "/api/users/getUserDataByUID",
        controller.users.getUserDataByUID
    );

    app.get(
        "/api/users/checkIfUserFilledBasicData",
        controller.users.checkIfUserFilledBasicData
    )

    app.get(
        "/api/users/getUserContactInfo",
        controller.users.getUserContactInfo
    )


    // =========================== PUT =========================== //



    // =========================== DELETE =========================== //



}
