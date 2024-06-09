import express, { Request, Response } from 'express';
import admin from 'firebase-admin';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

// Initialize Firestore (make sure to set your Firebase credentials correctly)
admin.initializeApp({
  credential: admin.credential.applicationDefault()
});
const db = admin.firestore();

// Endpoint to post new content
app.post('/content', async (req: Request, res: Response) => {
  try {
    const contentData = req.body;
    const contentRef = await db.collection('content').add(contentData);
    res.status(201).json({ id: contentRef.id });
  } catch (error) {
    console.error("Error adding document:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to get all content
app.get('/content', async (req: Request, res: Response) => {
  try {
    const contentRef = db.collection('content');
    const snapshot = await contentRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "No content found" });
    }

    const contentList: { id: string, [key: string]: any }[] = [];
    snapshot.forEach((doc: FirebaseFirestore.DocumentSnapshot) => {
      contentList.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(contentList);
  } catch (error) {
    console.error("Error fetching content:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to get specific content by ID
app.get('/content/:id', async (req: Request, res: Response) => {
  const contentId = req.params.id;

  try {
    const contentRef = db.collection('content').doc(contentId);
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
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});