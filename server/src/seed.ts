// seed.ts
import * as dotenv from "dotenv";
import { collections } from "./database"
import { MongoClient, Collection, Document } from "mongodb";
import { User } from "./user";
import { Product } from "./product";
dotenv.config();
const ATLAS_URI = process.env.ATLAS_URI || '';


async function fetchShoes(): Promise<Product[]> {
    const API_URL = "https://fakestoreapi.com/products/";
    try {
        const response = await fetch(API_URL);
        const data:any = await response.json();
        const productsWithQuantity = data.map((product: Product) => ({
            ...product,
            quantity: 50
        }));
        return productsWithQuantity as Product[];
    } catch (error) {
        error instanceof Error ? error.message : "Unknown error";
        return [];
    }
}




async function cleanDb(modelName:string, collectionName:string) {
    const client = new MongoClient(ATLAS_URI);
    await client.connect();
    const db = client.db('shoeStoreDatabase');
    
    try {
        // Drop the specified collection
        await db.collection(collectionName).drop();

        console.log(`${modelName} collection cleared successfully.`);
    } catch (error) {
        console.error(`Error clearing ${modelName} collection: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
        await client.close();
    }
}
async function seedDatabase() {
    const client = new MongoClient(ATLAS_URI);
    try {
        await client.connect()
        const db = client.db('shoeStoreDatabase')
        await cleanDb('User', 'users');
        await cleanDb('Product', 'products');

        // // Ensure the users collection is available
        // if (!collections?.users) {
        //     throw new Error("Users collection not found.");
        // }

        // // Ensure the products collection is available
        // if (!collections?.products) {
        //     throw new Error("Products collection not found.");
        // }

        const productsSeeds = await fetchShoes(); // Wait for the promise to resolve

        const productsCollection = db.collection('products');
        const result = await productsCollection.insertMany(productsSeeds);

        console.log("Database seeded successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1); // Exit with a failure code
    } finally {
        await client.close();
    }
}


seedDatabase();
