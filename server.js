import express from "express";
import csvParser from "csv-parser";
import fs from "fs";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API to get Kaggle competitions list
app.get("/api/competitions", (req, res) => {
  const results = [];
  const csvPath = path.join(__dirname, "competitions.csv");

  fs.createReadStream(csvPath)
    .pipe(csvParser())
    .on("data", (data) => {
      // Ensuring data is properly formatted
      if (data.ref && data.reward && data.category) {
        results.push({
          ref: data.ref || "#",
          title: data.ref.split("/").pop().replace(/-/g, " ") || "Untitled",
          reward: data.reward || "N/A",
          category: data.category || "N/A",
        });
      }
    })
    .on("end", () => {
      res.json(results);
    })
    .on("error", (error) => {
      console.error("Error reading CSV:", error);
      res.status(500).json({ error: "Error reading competition data" });
    });
});

// Serve frontend
app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
