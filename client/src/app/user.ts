import { Cart } from "./cart";
import { Product } from "./product";
export interface User {
    _id?:string;
    username:string;
    email:string;
    password:string;
    cart?:Cart
    favorite:{
        items:Product[],
        total:number
    }
}
