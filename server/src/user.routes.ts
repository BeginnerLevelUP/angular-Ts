import express, { Request, Response, NextFunction } from "express";
import { ObjectId } from "mongodb";
import { collections } from "./database";
import { Cart } from "./cart"; // Import the Cart interface
import { Product } from "./product"; // Import the Product interface
import { User,Review } from "./user";

export const userRouter = express.Router();


userRouter.get("/user/:userId/cart/:productId", async (req: Request, res: Response, next: NextFunction) => {
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

      // Decrement product quantity by 1
      await collections?.products?.updateOne(queryProduct, { $inc: { quantity: -1 } });

      res.status(200).json(updateResult);
    } else {
      res.status(404).json({ error: "Product not found or out of stock" });
    }
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Unknown Error" });
  }
});

userRouter.delete("/user/:userId/cart/:productId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req?.params?.userId;
    const productId = req?.params?.productId;
    const queryUser = { _id: new ObjectId(userId) };
    const user = await collections?.users?.findOne<User>(queryUser);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the index of the item to remove from the cart
    const index = user.cart.items.findIndex(item => item.productId.toString() === productId);

    if (index === -1) {
      return res.status(404).json({ message: "Product not found in user's cart" });
    }

    // Get the item to be removed
    const removedItem = user.cart.items.splice(index, 1)[0];

    // Update user's cart in the database
    await collections?.users?.updateOne(queryUser, { $set: { "cart.items": user.cart.items } });

    // Add back the quantity to the product
    const product = await collections?.products?.findOne<Product>({ _id: new ObjectId(productId) });
    if (!product) {
      return res.status(404).json({ message: `Product with ID ${productId} not found` });
    }

    product.quantity += removedItem.quantity;

    // Update product's quantity in the database
    await collections?.products?.updateOne({ _id: new ObjectId(productId) }, { $set: { quantity: product.quantity } });

    res.status(200).json({ message: "Item removed from cart and quantity added back to product" });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Unknown Error" });
  }
});


userRouter.get("/user/:userId/cart/:productId/:quant", async (req: Request, res: Response, next: NextFunction) => {
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
      const quant = parseInt(req?.params?.quant);
      if (isNaN(quant)) {
        return res.status(400).json({ message: "Invalid quantity parameter" });
      }

      // Check if the requested quantity exceeds the available product quantity
      if (quant > product.quantity) {
        return res.status(400).json({ message: "Requested quantity exceeds available quantity in cart" });
      }

      // Subtract the quant parameter from the product quantity
      user.cart.items[itemInCartIndex].quantity=quant

      // Update the user's cart with the modified item
      await collections?.users?.findOneAndUpdate(queryUser, { $set: { "cart.items": user.cart.items } });
      // Update the product's quantity in the database
      await collections?.products?.updateOne(queryProduct, { $set: { quantity: product.quantity } });

      return res.status(200).json({ message: "Product quantity updated", user });
    } else {
      return res.status(404).json({ message: "Item not in cart" });
    }
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : "Unknown Error" });
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
    product.quantity -=item.quantity;
    item.total=product.price*item.quantity
    user.cart.cartTotal+=item.total

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
     res.status(202).send(favortieItem)
    
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Unknown Error" });
  }
});

userRouter.delete('/user/:userId/favorite/:productId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req?.params?.userId;
    const queryUser = { _id: new ObjectId(userId) };
    const user = await collections?.users?.findOne<User>(queryUser);

    const productId = req?.params?.productId;
    const queryProduct = { _id: new ObjectId(productId) };

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user.favorite exists
    if (!user.favorite || !user.favorite.items) {
      return res.status(400).json({ message: "User favorites are missing" });
    }

    // Check if the product is in the user's favorites
    const favoriteIndex = user.favorite.items.findIndex(item => item.productId.toString() === productId);
    if (favoriteIndex === -1) {
      return res.status(404).json({ message: "Product not found in user's favorites" });
    }

    // Remove the product from the user's favorites
    user.favorite.items.splice(favoriteIndex, 1);
    
    // Update the user document in the database
    await collections?.users?.updateOne(queryUser, { $set: { "favorite.items": user.favorite.items } });

    res.status(200).json({ message: "Product removed from favorites" });

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
        const currentUser=await collections.users?.findOne({_id:new ObjectId(userId)})
        if(currentUser){

        const updatedReviewData: Review = {
            _id: new ObjectId(reviewId),
            by: currentUser.username, // Assuming this is not updated
            comment: req.body.comment,
            rating: req.body.rating
        };

        // Update the review in the user document
        const updatedUserReview = await collections?.users?.findOneAndUpdate(
            { _id: new ObjectId(userId), "reviews._id": updatedReviewData._id },
            { $set: { "reviews.$": {...updatedReviewData }} },
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
        }else{
          res.status(404).send('user not found')
        }

    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : "Unknown Error" });
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