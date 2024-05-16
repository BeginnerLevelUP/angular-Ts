import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectToDatabase } from "./src/database";
import {userRouter} from "./src/user.routes";
import { productRouter } from "./src/product.routes";
import authRouter from "./src/auth.routes";
import auth from "./src/auth";
// Load environment variables from the .env file, where the ATLAS_URI is configured
dotenv.config();

const { ATLAS_URI } = process.env;

if (!ATLAS_URI) {
  console.error(
    "No ATLAS_URI environment variable has been defined in config.env"
  );
  process.exit(1);
}

connectToDatabase(ATLAS_URI)
  .then(() => {
    const app = express();
    app.use(express.json());
    app.use(cors());
    app.use('/api',authRouter)
    app.use('/api/profile',auth.authMiddleware)
    app.use("/api/", userRouter,auth.authMiddleware);
    app.use("/api/", productRouter);
    // start the Express server
    app.listen(process.env.PORT || 5200, () => {
      console.log(`Server running at http://localhost:5200...`);
    });
  })
  .catch((error) => console.error(error));