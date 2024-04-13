import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "./database";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken"
import auth from "./auth";
import { User } from "./user";
export const authRouter = express.Router();


authRouter.post("/auth/register", async (req, res) => {
    try {
        const { _id, username, password, email } = req.body;
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user object with the hashed password
        const user:User = {
            _id: _id,
            username: username,
            password: hashedPassword,
            email: email,
            cart:{
                items: [],
                cartTotal: 0,
            }
        };

        const result = await collections?.users?.insertOne(user);

        if (result?.acknowledged) {
            // Check if result is defined before using it
            const insertedId = result.insertedId;

            // Make sure to check if insertedId is not null or undefined
            if (insertedId) {
                // Assuming result is of type InsertOneResult<User> and insertedId is of type ObjectId
                const token = auth.signToken({
                    _id: insertedId.toString(),
                    username: username,
                    email: email
                });
                console.log(token)
                res.status(201).json(token);
            } else {
                res.status(500).send("Failed to create a new user: No inserted ID.");
            }
        } else {
            res.status(500).send("Failed to create a new user.");
        }
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
});



authRouter.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await collections?.users?.findOne({ email: email });
        if (!user) {
            return res.status(401).json({ error: 'User Not Found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed' });
        }

        // Generate a JWT token upon successful authentication
        const token = auth.signToken({
            _id: user._id.toString(),
            email: user.email,
            username: user.username
        });

        // Send the response with the JWT token
        res.status(200).json(token );
    } catch (error) {
        console.error(error);
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
});


export default authRouter;
