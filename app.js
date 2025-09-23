import express from "express";
import dotenv from 'dotenv';
import { productRoutes } from "./src/routes/ProductRoutes.js";
import { getuserdata } from "./src/routes/UserRoutes.js";
import connectDB from "./src/config/db.js";
import { initOCR } from "./src/service/ocrService.js";


const app = express();
dotenv.config();


connectDB();

app.use(express.json());

// --- initialize OCR worker ek vaar startup time ma ---
(async () => {
  try {
    await initOCR();
  } catch (err) {
    console.error("❌ OCR init failed:", err);
  }
})();

app.use("/api/products", productRoutes);
app.use("/api/getuser", getuserdata);



app.get("/", (req, res) => {
  res.send("API is working ✅");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

