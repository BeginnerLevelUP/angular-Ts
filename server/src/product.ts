
import { ObjectId } from "mongodb";

interface Review{
    _id:ObjectId
    by:string,
    rating:number,
    comment:string
}

export interface Product {
  _id:ObjectId;
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
  quantity:number,
  reviews:Review[]
}
