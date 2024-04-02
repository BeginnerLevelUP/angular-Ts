
import * as mongodb from "mongodb"
export interface User{
    _id?:mongodb.ObjectId;
    firstName:string;
    lastName:string;
    username:string;
    email:string;
    password:string;
}   