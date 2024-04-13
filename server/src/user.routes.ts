import express, { Request, Response, NextFunction } from "express";
import { ObjectId } from "mongodb";
import { collections } from "./database";
import { Cart } from "./cart"; // Import the Cart interface
import { Product } from "./product"; // Import the Product interface
import { User } from "./user";

export const userRouter = express.Router();
const updateProductQuantitiesMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req?.params?.userId;
    const queryUser = { _id: new ObjectId(userId) };
    const user = await collections?.users?.findOne<User>(queryUser);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    // Loop through each item in the user's cart
    for (const item of user.cart.items) {
      
      //Update Quantites
      const productId = item.productId;
      const product = await collections?.products?.findOne<Product>({ _id: productId });

      if (!product) {
        return res.status(404).json({ message: `Product with ID ${productId} not found` });
      }

      // Check if there is enough quantity available
      if (product.quantity < item.quantity) {
        return res.status(400).json({ message: `Insufficient quantity for product ${productId}` });
      }
        // Update the item total in the user's cart
      const filter = { userId: user._id, "cart.items.productId": productId };
      const update = { $set: { "cart.items.$.total": item.total } };

      item.total=item.quantity*product.price
  
      product.quantity -= item.quantity;

      // Update the product in the database
      await collections?.users?.updateOne(filter, update);
      await collections?.products?.updateOne({ _id: productId }, { $set: { quantity: product.quantity } });
    }

    // If all products have enough quantity, proceed to the next middleware
    next()
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Unknown Error" });
  }
};

userRouter.post("/user/:userId/cart/:productId",updateProductQuantitiesMiddleware, async (req:Request, res:Response, next:NextFunction) => {
  try {
    const productId = req?.params?.productId;
    const queryProduct = { _id: new ObjectId(productId) };
    const product = await collections?.products?.findOne<Product>(queryProduct);

    if (product && product.quantity >= 1) {
      const userId = req?.params?.userId;
      const queryUser = { _id: new ObjectId(userId) };

      // Create the product object to add to the cart
      const cartItem: { productId: ObjectId; quantity: number; total: number } = {
        productId: product._id,
        quantity: 1,
        total: product.price,
      };

      // Update the user's cart with the new product
      const updateResult = await collections?.users?.findOneAndUpdate(
        queryUser,
        { $addToSet: { "cart.items": cartItem } },
        { returnDocument: "after" } // This ensures you get the updated document back
      );
      res.status(200).json(updateResult)
    }
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Unknown Error" });
  }
});


userRouter.put("/user/:userId/cart/:productId",updateProductQuantitiesMiddleware,async (req:Request, res:Response, next:NextFunction) => {
  try {
    const userId = req?.params?.userId;
    const queryUser = { _id: new ObjectId(userId) };
    const user = await collections?.users?.findOne<User>(queryUser);

    const productId = req?.params?.productId;
    const queryProduct = { _id: new ObjectId(productId) };
    const product = await collections?.products?.findOne<Product>(queryProduct);

    // Check if the user and product exist
    if (!user || !product) {
      return res.status(404).json({ message: "User or Product not found" });
    }
   // Check if user.cart exists
    if (!user.cart) {
      return res.status(400).json({ message: "User cart is missing" });
    }

    const itemInCartIndex = user.cart.items.findIndex((item) => item.productId.equals(product._id));

    if (itemInCartIndex !== -1) {
      // If item exists, update its properties
      user.cart.items[itemInCartIndex] = {
        ...user.cart.items[itemInCartIndex],
        ...req?.body,
      };

      if(user.cart.items[itemInCartIndex].quantity>product.quantity){
        res.status(500).json({ message: "Not Enough Quant" });
      }else{
      await collections?.users?.findOneAndUpdate(queryUser, { $set: { "cart.items": user.cart.items } });
      res.status(200).json({ message: "Product updated" });
      }

    } else {
      res.status(404).json({ message: "Item not in cart" });
    }
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Unknown Error" });
  }
});




