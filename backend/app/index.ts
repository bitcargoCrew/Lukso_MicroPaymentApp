import express, { Request, Response } from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import multer, { Multer } from "multer";
import transferTokenRead from "./services/transferTokenRead";
import transferTokenLike from "./services/transferTokenLike";
import getAllTokenHolder from "./services/getAllTokenHolders";
import { getLuksoJobs } from "./services/getLuksoJobs" // Import the function

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");

// Extend the Request interface to include file properties for multer
declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File; // Ensure this matches the type from multer
      files?:
        | { [fieldname: string]: Express.Multer.File[] }
        | Express.Multer.File[]
        | undefined;
    }
  }
}

// Determine the path to the service account key file
const isRender = process.env.RENDER || false;
const serviceAccountPath = isRender
  ? "/etc/secrets/serviceAccountKey.json"
  : path.resolve(__dirname, "serviceAccountKey.json");

// Read the service account key file
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

const app = express();
app.use(express.json());
app.use(cors());

// Initialize Firebase
initializeApp({
  credential: cert(serviceAccount),
  storageBucket: "gs://contentplatform-d4755.appspot.com",
});
const db = getFirestore();
const storage = getStorage();
const bucket = storage.bucket();

// Export db for use in other modules
export { db };

// Configure multer for file uploads
const upload: Multer = multer({
  storage: multer.memoryStorage(), // Store files in memory temporarily
  limits: { fileSize: 20 * 1024 * 1024 }, // Limit file size to 20MB
});

// Endpoint to post new content with an image
app.post(
  "/postContent",
  upload.single("contentMedia"),
  async (req: Request, res: Response) => {
    try {
      const contentData = req.body;
      const uniqueContentId = uuidv4();
      contentData.contentId = uniqueContentId; // Assign uniqueContentId to contentId in contentData

      // Convert numeric fields from strings to numbers
      contentData.contentCosts = Number(contentData.contentCosts);
      contentData.numberOfRead = Number(contentData.numberOfRead);
      contentData.numberOfLikes = Number(contentData.numberOfLikes);
      contentData.numberOfComments = Number(contentData.numberOfComments);

      if (req.file) {
        const blob = bucket.file(`images/${uniqueContentId}`);
        const blobStream = blob.createWriteStream({
          metadata: {
            contentType: req.file.mimetype,
          },
          gzip: true, // Enable compression if needed
        });

        blobStream.on("error", (error: Error) => {
          console.error("Blob stream error:", error);
          res.status(500).json({ error: "Failed to upload image" });
        });

        blobStream.on("finish", async () => {
          await db.collection("content").doc(uniqueContentId).set(contentData);
          res.status(201).json({ id: uniqueContentId });
        });

        blobStream.end(req.file.buffer);
      } else {
        await db.collection("content").doc(uniqueContentId).set(contentData);
        res.status(201).json({ id: uniqueContentId });
      }
    } catch (error) {
      console.error("Error adding document:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Endpoint to get all content with picture URL
app.get("/allContent", async (req: Request, res: Response) => {
  try {
    const contentRef = db.collection("content");
    const snapshot = await contentRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "No content found" });
    }

    const contentList: { id: string; [key: string]: any }[] = [];
    await Promise.all(
      snapshot.docs.map(async (doc: any) => {
        const contentData = doc.data();
        // Construct the storage path and get signed URL
        const file = bucket.file(`images/${contentData.contentId}`);
        const [url] = await file.getSignedUrl({
          action: "read",
          expires: "01-01-2500",
        });
        contentData.contentMedia = url;
        contentList.push({ id: contentData.contentId, ...contentData });
      })
    );

    res.status(200).json(contentList);
  } catch (error) {
    console.error("Error fetching content:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to get specific content by ID
app.get("/content/:id", async (req: Request, res: Response) => {
  const contentId = req.params.id;

  try {
    const contentRef = db.collection("content").doc(contentId);
    const doc = await contentRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Content not found" });
    }

    const contentData = doc.data();
    const file = bucket.file(`images/${contentData.contentId}`);
    const [url] = await file.getSignedUrl({
      action: "read",
      expires: "01-01-2500",
    });
    contentData.contentMedia = url;
    res.status(200).json(contentData);
  } catch (error) {
    console.error("Error fetching document:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to update numberOfRead or numberOfLikes for specific content by ID
app.put("/content/:id", async (req: Request, res: Response) => {
  const contentId = req.params.id;
  const { numberOfLikes, numberOfRead, contentCosts, contentSupporter } = req.body;
  console.log("Request body:", req.body);

  try {
    const contentRef = db.collection("content").doc(contentId);
    const doc = await contentRef.get();

    if (!doc.exists) {
      res.status(404).json({ error: "Content not found" });
      return;
    }

    // Update the document with the provided numberOfLikes or numberOfRead
    let updateFields: { numberOfLikes?: number; numberOfRead?: number } = {};
    if (numberOfRead !== undefined) {
      updateFields.numberOfRead = numberOfRead;
      transferTokenRead(contentSupporter, contentCosts, contentId); //send token to the UP who paid for a post
    }
    if (numberOfLikes !== undefined) {
      updateFields.numberOfLikes = numberOfLikes;
      transferTokenLike(contentSupporter, contentId); //send token to the UP who like a post
    }

    // Ensure there is at least one field to update
    if (Object.keys(updateFields).length === 0) {
      res.status(400).json({ error: "No valid fields to update" });
      return;
    }

    await contentRef.update(updateFields);

    res.status(200).json({ message: "Content updated successfully" });
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to get aggregated data for all contentSupporters
app.get("/aggregateSocialLeaderboard", async (req: Request, res: Response) => {
  try {
    const contentRef = db.collection("socialLeaderboard");
    const snapshot = await contentRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "No content found" });
    }

    // Object to hold aggregated data
    const aggregation: { [key: string]: { totalLikes: number; totalReads: number; totalTokensReceived: number } } = {};

    snapshot.docs.forEach((doc: any) => {
      const data = doc.data();
      const supporter = data.contentSupporter;

      if (!aggregation[supporter]) {
        aggregation[supporter] = {
          totalLikes: 0,
          totalReads: 0,
          totalTokensReceived: 0,
        };
      }

      aggregation[supporter].totalLikes += data.likes || 0;
      aggregation[supporter].totalReads += data.reads || 0;
      aggregation[supporter].totalTokensReceived += parseInt(data.numberOfTokensReceived) || 0;
    });

    // Convert aggregation object to an array
    const aggregatedList = Object.keys(aggregation).map(supporter => ({
      contentSupporter: supporter,
      ...aggregation[supporter],
    }));

    // Sort the aggregated list by totalTokensReceived in descending order
    aggregatedList.sort((a, b) => b.totalTokensReceived - a.totalTokensReceived);

    res.status(200).json(aggregatedList);
  } catch (error) {
    console.error("Error fetching content:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to get top 3 entries based on totalTokensReceived
app.get("/top3Supporters", async (req: Request, res: Response) => {
  try {
    const contentRef = db.collection("socialLeaderboard");
    const snapshot = await contentRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "No content found" });
    }

    // Object to hold aggregated data
    const aggregation: { [key: string]: { totalLikes: number; totalReads: number; totalTokensReceived: number } } = {};

    snapshot.docs.forEach((doc: any) => {
      const data = doc.data();
      const supporter = data.contentSupporter;

      if (!aggregation[supporter]) {
        aggregation[supporter] = {
          totalLikes: 0,
          totalReads: 0,
          totalTokensReceived: 0,
        };
      }

      aggregation[supporter].totalLikes += data.likes || 0;
      aggregation[supporter].totalReads += data.reads || 0;
      aggregation[supporter].totalTokensReceived += parseInt(data.numberOfTokensReceived) || 0;
    });

    // Convert aggregation object to an array
    const aggregatedList = Object.keys(aggregation).map(supporter => ({
      contentSupporter: supporter,
      ...aggregation[supporter],
    }));

    // Sort the aggregated list by totalTokensReceived in descending order
    aggregatedList.sort((a, b) => b.totalTokensReceived - a.totalTokensReceived);

    // Get the top 3 entries
    const top3 = aggregatedList.slice(0, 3);

    res.status(200).json(top3);
  } catch (error) {
    console.error("Error fetching content:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to get the last 20 transactions/entries
app.get("/last20Transactions", async (req: Request, res: Response) => {
  try {
    const contentRef = db.collection("socialLeaderboard").orderBy("timestamp", "desc").limit(20);
    const snapshot = await contentRef.get();
    console.log(snapshot)

    if (snapshot.empty) {
      return res.status(404).json({ error: "No transactions found" });
    }

    // Map the documents to their data
    const transactions = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to get job listings from Lukso
app.get("/getLuksoJobs", async (req: Request, res: Response) => {
  try {
    const jobs = await getLuksoJobs();
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching job listings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// get all token holders from Quill - Does not work so far..
app.get("/getAllTokenHolders", async (req: Request, res: Response) => {
  try {
      const data = await getAllTokenHolder();
      res.json(data); // Send JSON response with fetched data
  } catch (error: any) {
      res.status(500).json({ error: error.message }); // Handle error response
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
