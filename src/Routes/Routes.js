import { Authentication } from './Authentication.js'
import { Users } from './Users.js'
import { Offers } from './Offers.js';

export const Routes = {
    listenAuth: Authentication,
    listenUsers: Users,
    listenOffers: Offers
};
