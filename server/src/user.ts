import * as mongodb from "mongodb";
import {Cart,CartItem} from "./cart"
export interface Review{
    _id:mongodb.ObjectId
    by:string,
    rating:number,
    comment:string
}
export interface User {
    username: string;
    email: string;
    password: string;
    _id?: mongodb.ObjectId;
    cart:Cart,
    favorite:{
        items:CartItem[],
        total:number
    },
    reviews:Review[]
}

