import { Cart } from "./cart";
import { Product } from "./product";
interface Review{
    by:string,
    rating:number,
    comment:string
}
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
    reviews:Review[]
}
