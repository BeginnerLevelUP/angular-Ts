import * as mongodb from "mongodb";

export interface User {
    lastName: string;
    firstName: string;
    username:string;
    email:string;
    password:string
    _id?: mongodb.ObjectId;
}