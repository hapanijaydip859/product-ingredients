import express from "express";
import { productRoutes } from "./routes/ProductRoutes.js";
import { initOCR } from "./service/ocrService.js";   // 👈 import OCR init
import { getuserdata } from "./routes/user.js";

const app = express();

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

export default app;
