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

    // =========================== GET =========================== //

    app.get(
        "/api/users/getUserData",
        controller.users.getUserData
    );

    app.get(
        "/api/users/checkIfUserFilledBasicData",
        controller.users.checkIfUserFilledBasicData
    )

    // =========================== PUT =========================== //



    // =========================== DELETE =========================== //



}
