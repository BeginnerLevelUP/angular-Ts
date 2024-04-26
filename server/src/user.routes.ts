import express, { Request, Response, NextFunction } from "express";
import { ObjectId } from "mongodb";
import { collections } from "./database";
import { Cart } from "./cart"; // Import the Cart interface
import { Product } from "./product"; // Import the Product interface
import { User,Review } from "./user";

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
      // if (product.quantity < item.quantity) {
      //   return res.status(400).json({ message: `Insufficient quantity for product ${productId}` });
      // }
// Update the item total in the user's cart
const filter = { _id: user._id };
const cartTotal = user.cart.items.reduce((total, item) => {
  if (item.productId === productId) {
    return total + (item.quantity * product.price); // Assuming product has a price field
  }
  return total + (item.quantity * product.price); // Or use item's price directly
}, 0);

const update = { $set: { "cart.cartTotal": cartTotal } };

product.quantity -= item.quantity;

// Update the user's cartTotal in the database
await collections?.users?.findOneAndUpdate(filter, update);
      await collections?.products?.updateOne({ _id: productId }, { $set: { quantity: product.quantity } });
    }

    // If all products have enough quantity, proceed to the next middleware
    next()
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Unknown Error" });
  }
};

userRouter.get("/user/:userId/cart/:productId",updateProductQuantitiesMiddleware, async (req:Request, res:Response, next:NextFunction) => {
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
      res.status(200).json({ message: "Product updated",user });
      }

    } else {
      res.status(404).json({ message: "Item not in cart" });
    }
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Unknown Error" });
  }
});

userRouter.get('/user/profile/:userId',async(req: Request, res: Response, next: NextFunction)=>{
  try{
    const userId=req.params.userId
    const user= await collections?.users?.findOne({_id:new ObjectId(userId)})

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

for(const item of user?.cart.items){
    const productId = item.productId;
    const product = await collections?.products?.findOne<Product>({ _id: productId });

    if (!product) {
        return res.status(404).json({ message: `Product with ID ${productId} not found` });
    }

    // Spread the properties of `product` into `item`
    Object.assign(item, product);
}

for(const item of user?.favorite.items){
    const productId = item.productId;
    const product = await collections?.products?.findOne<Product>({ _id: productId });

    if (!product) {
        return res.status(404).json({ message: `Product with ID ${productId} not found` });
    }

    // Spread the properties of `product` into `item`
    Object.assign(item, product);
}    
 user.favorite.items = user.favorite.items.map(item => ({ ...item }))
 user.cart.items = user.cart.items.map(item => ({ ...item }))
    res.status(200).send(user)
  }catch(error){
      error instanceof Error ? error.message : "Uknow Error"
  }
})

userRouter.get('/user/:userId/favorite/:productId', async (req: Request, res: Response, next: NextFunction) => {
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

    // Check if user.favorite exists
    if (!user.favorite || !user.favorite.items) {
      return res.status(400).json({ message: "User favorites are missing" });
    }
      const favortieItem: { productId: ObjectId; quantity: number; total: number } = {
        productId: product._id,
        quantity: 0,
        total: product.price,
      };

      await collections?.users?.findOneAndUpdate(queryUser, { $addToSet: { "favorite.items": favortieItem} });
     


    
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Unknown Error" });
  }
});

userRouter.post('/user/:userId/comment/:productId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.userId;
        const productId = req.params.productId;

        const currentUser = await collections?.users?.findOne({ _id: new ObjectId(userId) });
        if (!currentUser) {
            return res.status(404).send('User not found');
        }

        // Check if the product exists (Assuming you have a products collection)
        const product = await collections?.products?.findOne({ _id: new ObjectId(productId) });
        if (!product) {
            return res.status(404).send('Product not found');
        }

        const newReview: Review = {
            _id:new ObjectId,
            product:new ObjectId(productId),
            by: currentUser?.username || '',
            comment: req.body.comment,
            rating: req.body.rating
        };

        const updatedUser = await collections?.users?.findOneAndUpdate(
            { _id: new ObjectId(userId) },
            { $addToSet: { "reviews": newReview } }
        );

        if (!updatedUser) {
            return res.status(500).send('Failed to add review');
        }

        // Update the product with the new review
        const updatedProduct = await collections?.products?.findOneAndUpdate(
            { _id: new ObjectId(productId) },
            { $addToSet: { "reviews": newReview } }
        );

        if (!updatedProduct) {
            return res.status(500).send('Failed to update product with review');
        }

        res.status(200).send('Review added successfully');
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : "Unknown Error" });
    }
});

userRouter.put('/user/:userId/review/:reviewId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.userId;
        const reviewId = req.params.reviewId;

        const updatedReviewData: Review = {
            _id: new ObjectId(reviewId),
            by: '', // Assuming this is not updated
            comment: req.body.comment,
            rating: req.body.rating
        };

        // Update the review in the user document
        const updatedUserReview = await collections?.users?.findOneAndUpdate(
            { _id: new ObjectId(userId), "reviews._id": updatedReviewData._id },
            { $set: { "reviews.$": updatedReviewData } },
        );

        if (!updatedUserReview) {
            return res.status(404).send('User review not found');
        }

        // Update the corresponding review in the product document
        const updatedProductReview = await collections?.products?.updateOne(
            { "reviews._id": updatedReviewData._id },
            { $set: { "reviews.$": updatedReviewData } }
        );

        if (!updatedProductReview) {
            return res.status(500).send('Failed to update product review');
        }

        res.status(200).send('Review updated successfully');
    } catch (error) {
        next(error); // Forward the error to the error handling middleware
    }
});

userRouter.delete('/user/:userId/review/:reviewId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.userId;
        const reviewId = req.params.reviewId;

        // Delete the review from the user document
        const deletedUserReview = await collections?.users?.findOneAndUpdate(
            { _id: new ObjectId(userId) },
            { $pull: { "reviews": { _id: new ObjectId(reviewId) } } }
        );

        if (!deletedUserReview) {
            return res.status(404).send('User review not found');
        }

        // Delete the review from the product document
        const deletedProductReview = await collections?.products?.updateOne(
            { "reviews._id": new ObjectId(reviewId) },
            { $pull: { "reviews": { _id: new ObjectId(reviewId) } } }
        );

        if (!deletedProductReview) {
            return res.status(500).send('Failed to delete product review');
        }

        res.status(200).send('Review deleted successfully');
    } catch (error) {
        next(error); // Forward the error to the error handling middleware
    }
});