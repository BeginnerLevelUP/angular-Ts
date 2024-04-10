import { Cart } from "./cart";

export interface User {
    _id?:string;
    username:string;
    email:string;
    password:string;
    cart?:Cart
}
