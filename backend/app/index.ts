import express, { Request, Response } from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import transferTokenRead from "./services/transferTokenRead";
import transferTokenLike from "./services/transferTokenLike";

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");
const { PinataSDK } = require("pinata-web3");
require("dotenv").config();

const pinata = new PinataSDK({
  pinataJwt: process.env.API_JWT_PINATA,
  pinataGateway: process.env.GATEWAY_URL,
  pinataGatewayKey: process.env.GATEWAY_KEY_PINATA,
});

// Determine the path to the service account key file
const isRender = process.env.RENDER || false;
const serviceAccountPath = isRender
  ? "/etc/secrets/serviceAccountKey.json"
  : path.resolve(__dirname, "serviceAccountKey.json");

// Read the service account key file
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

const app = express();

app.use(cors({
  origin: [
    'https://lukso-micropaymentapp.onrender.com', 
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Add this if you're using cookies or authentication
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log('Incoming request from origin:', req.get('origin'));
  next();
});

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

interface UrlObject {
  url: string;
}

app.post("/postContentDatabase", async (req: Request, res: Response) => {
  try {
    const {
      postCID,
      contentId,
      contentCreator,
      contentCosts,
      numberOfRead,
      numberOfLikes,
      numberOfComments,
      contentComments,
      contentSupporters,
    } = req.body;

    if (!postCID) {
      return res.status(400).json({ error: "postCID is required" });
    }

    // Save the postCID with a generated document ID, or use postCID as the ID if it is unique.
    const contentRef = await db
      .collection("contentPostData")
      .doc(contentId)
      .set({
        postCID,
        contentId,
        contentCreator,
        contentCosts,
        numberOfRead,
        numberOfLikes,
        numberOfComments,
        contentComments,
        contentSupporters,
      });

    console.log("Content stored successfully", contentRef);

    res.status(200).json({ message: "Content stored successfully" });
  } catch (error) {
    console.error("Error storing contentPostData:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/allContentCID", async (req: Request, res: Response) => {
  try {
    const contentRef = db.collection("contentPostData");
    const snapshot = await contentRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "No contentPostData found" });
    }

    // Map through the snapshot, adding doc.id to each document's data
    const cidList = snapshot.docs.map((doc: any) => ({
      id: doc.id, // Add the document ID as a unique identifier
      ...doc.data(), // Spread the rest of the document data
    }));

    res.status(200).json(cidList);
  } catch (error) {
    console.error("Error fetching content:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/getAllContentPosts", async (req: Request, res: Response) => {
  try {
    const contentRef = db.collection("contentPostData");
    const snapshot = await contentRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "No contentPostData found" });
    }

    // Map through the snapshot, adding doc.id to each document's data
    const cidList = snapshot.docs.map((doc: any) => ({
      id: doc.id, // Add the document ID as a unique identifier
      ...doc.data(), // Spread the rest of the document data
    }));

    res.status(200).json(cidList);
  } catch (error) {
    console.error("Error fetching content:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/getAllContentPostsFromIPFS", async (req: Request, res: Response) => {
  try {
    // Reference to the "contentPostData" collection in Firestore
    const contentRef = db.collection("contentPostData");
    const snapshot = await contentRef.get();

    // If no documents exist, return a 404 error
    if (snapshot.empty) {
      return res.status(404).json({ error: "No contentPostData found" });
    }

    // Map through the snapshot, adding doc.id to each document's data
    const cidList = snapshot.docs.map((doc: any) => ({
      contentId: doc.id,
      postCID: doc.data().postCID, // Assuming postCID is stored in Firestore
      ...doc.data(),
    }));

    // Fetch IPFS content for all CIDs
    const contentDataIPFS = await Promise.all(
      cidList.map(async (item: any) => {
        try {
          if (!item.postCID) {
            console.warn(`No CID found for document ${item.id}`);
            return null;
          }

          const response = await pinata.gateways.get(item.postCID);

          let ipfsData: any = response?.data;

          // Handle Blob data if necessary
          if (ipfsData instanceof Blob) {
            ipfsData = await ipfsData.text();
          }

          // Parse JSON if it's a string
          if (typeof ipfsData === "string") {
            ipfsData = JSON.parse(ipfsData);
          }

          // Validate data
          if (typeof ipfsData !== "object" || ipfsData === null) {
            console.error(`Invalid data format for CID ${item.postCID}`);
            return null;
          }

          // Map to consistent content interface
          return {
            ...item, // Spread original Firestore document data
            contentTitle: ipfsData.contentTitle,
            contentMedia: ipfsData.contentMedia,
            contentCreator: ipfsData.contentCreator,
            contentCosts: ipfsData.contentCosts,
            creatorMessage: ipfsData.creatorMessage,
            contentShortDescription: ipfsData.contentShortDescription,
            contentLongDescription: ipfsData.contentLongDescription,
            contentTags: ipfsData.contentTags,
            contentComments: ipfsData.contentComments,
          };
        } catch (error) {
          console.error(
            `Error fetching IPFS content for CID ${item.postCID}:`,
            error
          );
          return null;
        }
      })
    );

    // Filter out null results and send response
    const validContent = contentDataIPFS.filter((content) => content !== null);

    res.status(200).json(validContent);
  } catch (error) {
    console.error("Error fetching content:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to get specific content by ID
app.get("/getContent/:id", async (req: Request, res: Response) => {
  const contentId = req.params.id;

  try {
    const contentRef = db.collection("contentPostData").doc(contentId);
    const doc = await contentRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Content not found" });
    }

    const contentData = doc.data();

    // Check if postCID exists
    if (!contentData?.postCID) {
      return res
        .status(400)
        .json({ error: "No IPFS CID associated with this content" });
    }

    try {
      const response = await pinata.gateways.get(contentData.postCID);
      let ipfsData: any = response?.data;

      // Handle Blob data if necessary
      if (ipfsData instanceof Blob) {
        ipfsData = await ipfsData.text();
      }

      // Parse JSON if it's a string
      if (typeof ipfsData === "string") {
        ipfsData = JSON.parse(ipfsData);
      }

      // Validate data
      if (typeof ipfsData !== "object" || ipfsData === null) {
        return res.status(500).json({
          error: "Invalid IPFS content format",
          cid: contentData.postCID,
        });
      }

      // Merge Firestore data with IPFS data
      const mergedContent = {
        ...contentData, // Original Firestore data
        contentTitle: ipfsData.contentTitle,
        contentMedia: ipfsData.contentMedia,
        contentCreator: ipfsData.contentCreator,
        contentCosts: ipfsData.contentCosts,
        creatorMessage: ipfsData.creatorMessage,
        contentShortDescription: ipfsData.contentShortDescription,
        contentLongDescription: ipfsData.contentLongDescription,
        contentTags: ipfsData.contentTags,
        contentComments: ipfsData.contentComments,
      };

      res.status(200).json(mergedContent);
    } catch (error) {
      console.error(
        `Error fetching IPFS content for CID ${contentData.postCID}:`,
        error
      );
      return null;
    }
  } catch (error) {
    console.error("Error fetching document:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to update numberOfRead numberOfLikes for specific content by ID
app.put("/updateContent/:id", async (req: Request, res: Response) => {
  const contentId = req.params.id;
  const { numberOfLikes, numberOfRead, contentCosts, contentSupporter } =
    req.body;
  console.log("Request body:", req.body);

  try {
    const contentRef = db.collection("contentPostData").doc(contentId);
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

app.put("/updateSupporters/:id", async (req: Request, res: Response) => {
  const contentId = req.params.id;
  const { supporter } = req.body; // Assuming 'supporter' is the single supporter being added
  console.log("Request body:", req.body);

  if (!supporter) {
    return res.status(400).json({ error: "Supporter ID is required" });
  }

  try {
    const contentRef = db.collection("contentPostData").doc(contentId);
    const doc = await contentRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Content not found" });
    }

    // Get the current list of supporters
    const currentData = doc.data();
    const currentSupporters: string[] = currentData?.contentSupporters || [];

    // Check if supporter is already in the list
    if (currentSupporters.includes(supporter)) {
      return res
        .status(200)
        .json({ message: "Supporter already exists, no update required." });
    }

    // Add new supporter
    const updatedSupporters = [...currentSupporters, supporter];

    // Update the document
    await contentRef.update({ contentSupporters: updatedSupporters });

    return res.status(200).json({ message: "Supporter added successfully" });
  } catch (error) {
    console.error("Error updating document:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get(
  "/getContentPerSupporter/:contentSupporter",
  async (req: Request, res: Response) => {
    const contentSupporter = req.params.contentSupporter;

    try {
      // Reference to the "socialLeaderboard" collection
      const contentRef = db.collection("socialLeaderboard");

      // Query the collection where the contentSupporter matches
      const snapshot = await contentRef
        .where("contentSupporter", "==", contentSupporter)
        .get();

      if (snapshot.empty) {
        return res
          .status(404)
          .json({ error: "No content found for this supporter" });
      }

      // Extract and accumulate the content IDs from the matching documents
      const contentIds: string[] = snapshot.docs.map(
        (doc: any) => doc.data().contentId
      );

      // Remove duplicates by converting the array to a Set and back to an array
      const uniqueContentIds = Array.from(new Set(contentIds));

      res.status(200).json({ uniqueContentIds });
    } catch (error: any) {
      console.error("Error fetching content IDs:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Endpoint to get aggregated data for all contentSupporters
app.get("/aggregateSocialLeaderboard", async (req: Request, res: Response) => {
  try {
    const contentRef = db.collection("socialLeaderboard");
    const snapshot = await contentRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "No content found" });
    }

    // Object to hold aggregated data
    const aggregation: {
      [key: string]: {
        totalLikes: number;
        totalReads: number;
        totalTokensReceived: number;
      };
    } = {};

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
      aggregation[supporter].totalTokensReceived +=
        parseInt(data.numberOfTokensReceived) || 0;
    });

    // Convert aggregation object to an array
    const aggregatedList = Object.keys(aggregation).map((supporter) => ({
      contentSupporter: supporter,
      ...aggregation[supporter],
    }));

    // Sort the aggregated list by totalTokensReceived in descending order
    aggregatedList.sort(
      (a, b) => b.totalTokensReceived - a.totalTokensReceived
    );

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
    const aggregation: {
      [key: string]: {
        totalLikes: number;
        totalReads: number;
        totalTokensReceived: number;
      };
    } = {};

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
      aggregation[supporter].totalTokensReceived +=
        parseInt(data.numberOfTokensReceived) || 0;
    });

    // Convert aggregation object to an array
    const aggregatedList = Object.keys(aggregation).map((supporter) => ({
      contentSupporter: supporter,
      ...aggregation[supporter],
    }));

    // Sort the aggregated list by totalTokensReceived in descending order
    aggregatedList.sort(
      (a, b) => b.totalTokensReceived - a.totalTokensReceived
    );

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
    const contentRef = db
      .collection("socialLeaderboard")
      .orderBy("timestamp", "desc")
      .limit(20);
    const snapshot = await contentRef.get();
    console.log(snapshot);

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

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
