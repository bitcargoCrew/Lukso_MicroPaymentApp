import cors from "cors";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import {
  getFirestore,
  Timestamp,
  FieldValue,
  Filter,
} from "firebase-admin/firestore";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const main = async () => {
  const app = express();

  // Firebase initialization
  const serviceAccount = require("../serviceAccountKey.json");

  initializeApp({
    credential: cert(serviceAccount),
  });

  const db = getFirestore();

  // Middleware
  app.use(express.json());
  app.use(cors());
  app.disable("x-powered-by");

  // Routes
  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.get("/content", async (req: Request, res: Response) => {
    // Automatically generate a unique ID for a new document in the "content" collection
    const uniqueId = uuidv4();
    const contentRef = db.collection("content").doc(uniqueId);

    try {
      await contentRef.set({
        contentID: uniqueId,
        contentTitle: "title",
        contentMedia: "image",
        contentCreator: "sandro",
        contentShortDescription: "Short Description",
        creatorMessage: "Thank you",
        contentLongDescription: "Long Description",
        numberOfRead: 5,
        numberofLikes: 5,
        numberOfComments: 5,
        contentComments: "This are a few comments",
      });
      res.status(200).send({ message: "Content created successfully", id: uniqueId });
    } catch (error) {
      console.error("Error setting document:", error);
    }
  });

  // Start the server
  const port = 3001;
  app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
  });
};

main();