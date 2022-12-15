import { Authentication } from './Authentication.js'
import { Users } from './Users.js'
import { Orders } from './Orders.js';

export const Routes = {
    listenAuth: Authentication,
    listenUsers: Users,
    listenOrders: Orders
};
