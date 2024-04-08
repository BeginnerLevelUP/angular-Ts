import * as express from "express";
import { ObjectId } from "mongodb";
import { collections } from "./database";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken"
export const authRouter = express.Router();
authRouter.use(express.json());


authRouter.post("/auth/register",async(req,res)=>{
    try {
        const { _id,username, password,email } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user object with the hashed password
        const user = {
            _id:_id,
            username: "pdffadfasfsapjf",
            password: hashedPassword,
            email:email
        };

        const result = await collections?.users?.insertOne(user);

        if (result?.acknowledged) {
            res.status(201).send(`Created a new user: ID ${result.insertedId}.`);
        } else {
            res.status(500).send("Failed to create a new user.");
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
})

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

        const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });

        // Set the token as a response header
        res.setHeader('Authorization', `Bearer ${token}`);

        // Send the response with user ID in the body
        res.status(201).send(`Found User with the ID: ${user?._id}`);
    } catch (error) {
        console.error(error);
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
});

export default authRouter;
