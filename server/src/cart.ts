
import { ObjectId } from 'mongodb';

interface CartItem {
  productId: ObjectId;
  quantity: number;
  total: number;
}
export interface Cart {
  items: CartItem[];
  cartTotal: number;
}
