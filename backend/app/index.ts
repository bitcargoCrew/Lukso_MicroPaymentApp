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

  app.post("/content", async (req: Request, res: Response) => {
    const {
      contentCreator,
      contentCosts,
      creatorMessage,
      contentTitle,
      contentMedia,
      contentShortDescription,
      contentLongDescription,
      contentTags,
    } = req.body;

    // Automatically generate a unique ID for a new document in the "content" collection
    const uniqueId = uuidv4();
    const contentRef = db.collection("content").doc(uniqueId);

    try {
      await contentRef.set({
        contentID: uniqueId,
        contentCreator,
        contentCosts,
        creatorMessage,
        contentTitle,
        contentMedia,
        contentShortDescription,
        contentLongDescription,
        contentTags,
        numberOfRead: 0, // Assuming initial values
        numberofLikes: 0,
        numberOfComments: 0,
        contentComments: [],
      });
      res
        .status(201)
        .json({ message: "Content created successfully", id: uniqueId });
    } catch (error) {
      console.error("Error setting document:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/content/:id", async (req, res) => {
    const contentId = req.params.id;
  
    try {
      const contentRef = db.collection("content").doc(contentId);
      const doc = await contentRef.get();
  
      if (!doc.exists) {
        return res.status(404).json({ error: "Content not found" });
      }
  
      const contentData = doc.data();
      res.status(200).json(contentData);
    } catch (error) {
      console.error("Error fetching document:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Start the server
  const port = 3001;
  app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
  });
};

main();