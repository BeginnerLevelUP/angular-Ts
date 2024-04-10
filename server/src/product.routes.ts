import express, { Request, Response ,NextFunction} from "express";
import { ObjectId } from "mongodb";
import { collections } from "./database";
import auth from "./auth";
export const productRouter = express.Router();

productRouter.get("/products",async(req:Request,res:Response,next:NextFunction)=>{
try{
    const products = await collections?.products?.find({}).toArray();
    res.status(200).send(products);
}catch(error){
    error instanceof Error? error.message : "Unknown error"
}
})

productRouter.get("/products/:id",async(req:Request,res:Response,next:NextFunction)=>{
try{
        const id = req?.params?.id;
        const query = { _id: new ObjectId(id) };
        const product = await collections?.products?.findOne(query);

        if (product) {
            res.status(200).send(product);
        } else {
            res.status(404).send(`Failed to find Product: ID ${id}`);
        }
}catch(error){
    error instanceof Error ? error.message : "Uknown error"
}
})