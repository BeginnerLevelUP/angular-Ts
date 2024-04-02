import * as express from "express";
import { ObjectId } from "mongodb";
import { collections } from "./database";



export const userRouter=express.Router()
userRouter.use(express.json())

userRouter.get("/",async(_req,res)=>{
    try{
        const users=await collections?.users?.find({}).toArray()
        res.status(200).send(users)
    }catch(e){
       res.status(500).send(e instanceof Error ? e.message : "Unknown error");
    }
})

userRouter.get("/:id",async(req,res)=>{
    try{
        const id=req?.params?.id
        const query={_id:new ObjectId(id)}
        const user=await collections?.users?.findOne(query)

        if(user){
            res.status(200).send(user)
        }else{
           res.status(404).send('Cannot Find User')         
        }
    }catch(e){
        res.status(404).send('Cannot Find User')
    }
})

userRouter.post('/',async(req,res)=>{
    try{
        const user=req.body
        const result=await collections?.users?.insertOne(user)

        if(result?.acknowledged){
            res.status(201).send(`Created a new user with ID ${result.insertedId}`)
        }else{
            res.status(500).send('Error Creating a new employee')
        }
    }catch(e){
        console.error(e)
        res.status(400).send(e instanceof Error? e.message:`Unknow Error`)
    }
})

userRouter.put('/:id',async(req,res)=>{
    try{
        const id=req?.params?.id
        const user=req.body
        const query={_id:new ObjectId(id)}
        const result=await collections?.users?.updateOne(query,{$set:user})

        if(result && result.matchedCount){
            res.status(200).send(`Updated User with ID ${id}`)
        }
        else if(!result?.matchedCount){
            res.status(404).send(`Failed to find user with ID ${id}`)
        }
        else{
            res.status(304).send(`Failed to update user with ID ${id}`)
        }
    }catch(e){
        console.error(e)
        res.status(400).send(e instanceof Error?e.message:'Unkown Error')
    }
})

userRouter.delete('/:id',async(req,res)=>{
    try{
        const id=req?.params.id
        const query={_id: new ObjectId(id) }
        const result=await collections?.users?.deleteOne(query)

        if(result?.deletedCount){
            res.status(200).send(`User with ID ${id} is now deleted`)
        }
        else if(!result?.deletedCount){
            res.status(400).send('Failed to delete account')
        }else{
            res.status(404).send('Failed to find account')
        }
    }catch(e){
        res.status(400).send(e instanceof Error?e.message:'Unknow Error')
    }
})