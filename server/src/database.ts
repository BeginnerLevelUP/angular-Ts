

//     // Try applying the modification to the collection, if the collection doesn't exist, create it 
//    await db.command({
//         collMod: "employees",
//         validator: jsonSchema
//     }).catch(async (error: mongodb.MongoServerError) => {
//         if (error.codeName === "NamespaceNotFound") {
//             await db.createCollection("employees", {validator: jsonSchema});
//         }
//     });
import * as mongodb from "mongodb"
import { User } from "./user"

export const collections:{
    users?:mongodb.Collection<User>
}={}

export async function connectToDatabase(uri:string){
    const client=new mongodb.MongoClient(uri)
    await client.connect()

    const db=client.db("shoeStoreDatabase")
    await applySchemaValidation(db)

    const usersCollection=db.collection<User>("users")
    collections.users=usersCollection
}

async function applySchemaValidation(db:mongodb.Db){
    const jsonSchema = {
        $jsonSchema: {
            bsonType: "object",
            required: ["username", "password",],
            additionalProperties: false,
            properties: {
                _id: {},
                firstName: {
                  bsonType:"string",
                  description:'The Offical First Name Of The User'  
                },
                lastName: {
                  bsonType:"string",
                  description:'The Offical Last Name Of The User'                      
                },
                username: {
                  bsonType:"string",
                  description:'Username Used On The Platform',
                  uniqueItems:true 
                },
                email:{
                  bsonType:"string",
                  description:"User's email address" ,
                  uniqueItems:true
                },
                password:{
                  bsonType:"string",
                  description:"User's password", 
                  minLength:8 
                }
            },
        },
}
}

