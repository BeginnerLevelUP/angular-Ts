
import { ObjectId } from 'mongodb';

export interface CartItem {
  productId: ObjectId;
  quantity: number;
  total: number;
}
export interface Cart {
  items: CartItem[];
  cartTotal: number;
}
