import ProductModel from "../model/ProductModel.js";
import User from "../model/user.js";
import { runOCR } from "../service/ocrService.js";

export const analyzeProduct = async (req, res) => {
  try {
    // console.log("req ==>", req.file);
    const userId = req.user.id
  console.log("userid", userId);
  

    if (!req.file) {
      return res.status(400).json({ error: "Image required" });
    }

    // OCR Run → returns full structured object
    const ocrResult = await runOCR(req.file.buffer);
    // console.log("sdddd", ocrResult);
    const userIdfind = await User.findOne({_id:userId})
    console.log("finddd==>" , userIdfind);
    
    // productName allow override from body
    const productName = req.body.productName || ocrResult.productName;

    // DB ma save karo
    const product = await ProductModel.create({
      productName,
      ingredients: ocrResult.ingredients,
      nutrition_per_100g: ocrResult.nutrition_per_100g,
      isHealthy: ocrResult.isHealthy,
      reason: ocrResult.reasons,
      UserData : userIdfind._id
    });

    // response moklo
    return res.status(201).json({
      success: true,
      data: product
    });
  } catch (err) {
    console.error("❌ analyzeProduct error:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { data } = req.query;
    const userId = req.user.id; // token verify middleware ma set thayel

    let products;

    if (!data) {
      // Default → 5 records
      products = await ProductModel.find({ UserData: userId })
        .sort({ createdAt: 1 })
        .limit(5)
        .populate("UserData", "name email"); // populate with only name & email
    } else if (data === "all") {
      // All records of this user
      products = await ProductModel.find({ UserData: userId })
        .sort({ createdAt: 1 })
        .populate("UserData", "name email");
    } else {
      // Invalid query param
      return res.status(400).json({
        success: false,
        message: `Invalid query parameter: '${data}'. Only 'all' is allowed.`,
      });
    }

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};



