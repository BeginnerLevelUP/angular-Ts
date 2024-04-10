import * as mongodb from 'mongodb'
import {Product} from "./product"
export interface Cart{
    items:Product[];
    Total:Number
}