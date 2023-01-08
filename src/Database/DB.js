import {Users} from './Users.js';
import {Authentication} from './Authentication.js'
import { Offers } from './Offers.js';
import { Ratings } from './Ratings.js';

export const db = {
    users: Users,
    authentication: Authentication,
    offers: Offers,
    ratings: Ratings
}