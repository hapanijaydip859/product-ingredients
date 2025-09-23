import mongoose from "mongoose";

const nutritionSchema = new mongoose.Schema({
  energy_kcal: Number,
  protein_g: Number,
  carbohydrates_g: Number,
  sugar_g: Number,
  added_sugars_g: Number,
  fat_g: Number,
  saturated_fat_g: Number,
  trans_fat_g: Number,
  cholesterol: String,
  sodium_mg: Number,
  salt_g: Number
}, { _id: false });

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  ingredients: [String],
  nutrition_per_100g: nutritionSchema,
  isHealthy: Boolean,
  reason: [String],
    UserData :{
    type : mongoose.Schema.Types.ObjectId,
    ref : "user"
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Product", productSchema);
