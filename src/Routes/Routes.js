import { Authentication } from './Authentication.js'
import { Users } from './Users.js'
import { Offers } from './Offers.js';
import { Ratings } from './Ratings.js';

export const Routes = {
    listenAuth: Authentication,
    listenUsers: Users,
    listenOffers: Offers,
    listenRatings: Ratings
};
