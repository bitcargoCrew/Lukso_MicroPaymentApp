import cors from "cors";
import express, { Request, Response } from "express";
import dotenv from "dotenv";

const main = async () => {
  const app = express();
  dotenv.config();

  // Middleware
  app.use(express.json());
  app.use(cors());
  app.disable("x-powered-by");

  // Routes
  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  // Start the server
  const port = 3001;
  app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
  });
};

main();
