import * as mongodb from "mongodb";
import { User } from "./user";
import { Product } from "./product";
export const collections: {
    users?: mongodb.Collection<User>,
    products?:mongodb.Collection<Product>
} = {};

export async function connectToDatabase(uri: string) {
    const client = new mongodb.MongoClient(uri);
    await client.connect();

    const db = client.db("shoeStoreDatabase");
    await applySchemaValidation(db);

    const usersCollection = db.collection<User>("users");
    const productsCollection=db.collection<Product>('products')
    collections.users = usersCollection;
    collections.products=productsCollection
}

// Update our existing collection with JSON schema validation so we know our documents will always match the shape of our Employee model, even if added elsewhere.
// For more information about schema validation, see this blog series: https://www.mongodb.com/blog/post/json-schema-validation--locking-down-your-model-the-smart-way
async function applySchemaValidation(db: mongodb.Db) {
    const jsonSchemaUser = {
        $jsonSchema: {
            bsonType: "object",
            required: ["username", "email", "password"],
            additionalProperties: true,
            properties: {
                _id: {},
                username: {
                    bsonType: "string",
                    description: "'username' is required and is a string",
                },
                email: {
                    bsonType: "string",
                    description: "'email' is required and is a string",
                    minLength: 5
                },
                password: {
                    bsonType: "string",
                    description: "'password' is required and is one of 'junior', 'mid', or 'senior'",
                },
                cart:{
                  bsonType:'object'
                }
            },
        },
    };
const jsonSchemaProduct = {
  $jsonSchema: {
    bsonType: "object",
    required: ["id", "title", "price", "description", "category", "image", "rating", "quantity"],
    additionalProperties: false,
    properties: {
      _id: {
        bsonType: "objectId",
      },
      id: {
        bsonType: "number",
        description: "'id' is required and is a number",
      },
      title: {
        bsonType: "string",
        description: "'title' is required and is a string",
      },
      price: {
        bsonType: "number",
        description: "'price' is required and is a number",
        minimum: 0,
      },
      description: {
        bsonType: "string",
        description: "'description' is required and is a string",
      },
      category: {
        bsonType: "string",
        description: "'category' is required and is a string",
      },
      image: {
        bsonType: "string",
        description: "'image' is required and is a string",
      },
      rating: {
        bsonType: "object",
        required: ["rate", "count"],
        properties: {
          rate: {
            bsonType: "number",
            description: "'rate' is required and is a number",
          },
          count: {
            bsonType: "number",
            description: "'count' is required and is a number",
          },
        },
      },
      quantity: {
        bsonType: "number",
        description: "'quantity' is required and is a number",
      },
    },
  },
};

 
   await db.command({
        collMod: "users",
        validator: jsonSchemaUser
    }).catch(async (error: mongodb.MongoServerError) => {
        if (error.codeName === "NamespaceNotFound") {
            await db.createCollection("users", {validator: jsonSchemaUser});
        }
    });

    await db.command({
        collMod:"products",
        validator:jsonSchemaProduct
    }).catch(async(error:mongodb.MongoServerError)=>{
        if(error.codeName==='NamespaceNotFound'){
            await db.createCollection('products',{validator:jsonSchemaProduct})
        }
    })
}