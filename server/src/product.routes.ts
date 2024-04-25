import express, { Request, Response ,NextFunction} from "express";
import { ObjectId } from "mongodb";
import { collections } from "./database";
import auth from "./auth";
import { emitWarning } from "process";
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

productRouter.get("/products/category/:category",async(req:Request,res:Response,next:NextFunction)=>{
    const category=req.params.category
    const productsByCategory=await collections?.products?.find({"category":category}).toArray()
    res.status(200).send(productsByCategory)

})

productRouter.get("/products/search/:query",async(req:Request,res:Response,next:NextFunction)=>{
try{
const searchTerm=req.params.query
const products=await collections.products?.find({}).toArray()||[]

if(!products){
    res.status(404).send('no products found')
}

const filterByTerm = products.filter(product => {
    const descriptionMatch = product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const titleMatch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    return descriptionMatch || titleMatch;
});


res.status(200).send(filterByTerm)
}
catch(error){
    error instanceof Error ? error.message : 'unknown error'
}

})