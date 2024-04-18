import * as mongodb from "mongodb";
import {Cart,CartItem} from "./cart"
export interface User {
    username: string;
    email: string;
    password: string;
    _id: mongodb.ObjectId;
    cart:Cart,
    favorite:{
        items:CartItem[],
        total:number
    }
}
