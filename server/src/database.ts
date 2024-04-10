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
    required: ["title", "price", "description", "images", "category"],
    additionalProperties: true,
    properties: {
      _id: {},
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
      images: {
        bsonType: "array",
        description: "'images' is required and is an array of strings",
        items: {
          bsonType: "string",
        },
        minItems: 1,
      },
      creationAt: {
        bsonType: "string",
        description: "'creationAt' is a string representing a date",
      },
      updatedAt: {
        bsonType: "string",
        description: "'updatedAt' is a string representing a date",
      },
      category: {
        bsonType: "object",
        description: "'category' is an object",
        required: ["id", "name", "image"],
        properties: {
          id: {
            bsonType: "number",
            description: "'id' is required and is a number",
          },
          name: {
            bsonType: "string",
            description: "'name' is required and is a string",
          },
          image: {
            bsonType: "string",
            description: "'image' is required and is a string",
          },
          creationAt: {
            bsonType: "string",
            description: "'creationAt' is a string representing a date",
          },
          updatedAt: {
            bsonType: "string",
            description: "'updatedAt' is a string representing a date",
          },
        },
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