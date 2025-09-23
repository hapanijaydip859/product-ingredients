import express from "express";
import multer from "multer";
import { analyzeProduct, getUsers } from "../controller/ProductController.js";
import { SecureToken } from "../middleware/secure.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/analyze",SecureToken, upload.single("image"), analyzeProduct);
router.get("/users" ,SecureToken ,getUsers)

export const productRoutes = router;