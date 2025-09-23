import sharp from "sharp";
import { createWorker } from "tesseract.js";

let worker;

// 🔹 OCR Worker Initialize
export async function initOCR() {
  worker = await createWorker("eng");
  console.log("✅ OCR Worker initialized");
}

function getWorker() {
  if (!worker) {
    throw new Error("OCR worker not initialized. Call initOCR() first.");
  }
  return worker;
}

// 🔹 Step 1: Clean OCR Text (normalize spelling/typos)
function cleanText(text = "") {
  if (typeof text !== "string") {
    text = String(text || "");
  }
  text = text
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/facis|facts?/g, "facts")
    .replace(/calore?s|caloreis/g, "calories")
    .replace(/prot[e1i]n|pro tein|protien|proten/g, "protein")
    .replace(/carb[o0]hydrates?|carbohydratse/g, "carbohydrates")
    .replace(/sug[a-z]+|suger|suggar/g, "sugar")
    .replace(/total\s*fat|fat[s]?|fats/g, "fat")
    .replace(/soduim|soidum|sodium/g, "sodium")
    .replace(/cholestrol/g, "cholesterol")
    .replace(/saturat[ea]d\s*fat|sat fat|saturatedfat/g, "saturated fat")
    .replace(/trans\s*fat|transfat/g, "trans fat");

  return text;
}

// 🔹 Step 2: Parse Ingredients
function parseIngredients(text = "") {
  if (!text) return [];
  // case-insensitive, allow OCR typos like "ingredlents"
  const regex = /ingred[i1]ents?[:\-]?\s*(.+)/i;
  const match = text.match(regex);
  if (!match) return [];
  
  return match[1]
    .split(/,|;/)          // split by comma or semicolon
    .map(i => i.trim())
    .filter(i => i.length > 0);
}
  

// 🔹 Step 3: Parse Nutrition Facts

function parseNutrition(text = "") {
  if (typeof text !== "string") text = String(text || "");
  text = text.toLowerCase();

function extractValue(regex, text = "") {
  if (!text) return 0;  // safeguard
  const match = text.match(regex);
  if (!match) return 0;
  let raw = match[1].replace(/[^\d.,]/g, "").replace(",", ".");
  let num = parseFloat(raw);
  return isNaN(num) ? 0 : num;
}

  return {
    energy_kcal: extractValue(/energy[^0-9]*([\d.,]+)/i, text),
    protein_g: extractValue(/prote[i1]n[s]?[^0-9]*([\d.,]+)/i, text),
    carbohydrates_g: extractValue(/carb[o0]hydrates?[^0-9]*([\d.,]+)/i, text),
    sugar_g: extractValue(/sugars?[^0-9]*([\d.,]+)/i, text),
    fat_g: extractValue(/fat[^0-9]*([\d.,]+)/i, text),
    saturated_fat_g: extractValue(/saturated\s*fat[^0-9]*([\d.,]+)/i, text),
    trans_fat_g: extractValue(/trans\s*fat[^0-9]*([\d.,]+)/i, text),
    cholesterol_mg: extractValue(/cholesterol[^0-9]*([\d.,]+)/i, text),
    sodium_mg: extractValue(/sodium[^0-9]*([\d.,]+)/i, text),
  };
}



// 🔹 Health Check
function healthCheck(n) {
  let reasons = [];

  if (n.sugar_g >= 10) reasons.push("High sugar");
  if (n.fat_g >= 17) reasons.push(`High total fat (${n.fat_g}g)`);
  if (n.saturated_fat_g >= 20) reasons.push(`High saturated fat (${n.saturated_fat_g}g)`);
  if (n.trans_fat_g >= 1) reasons.push("Contains trans fat");
  if (n.sodium_mg >= 400) reasons.push(`High sodium (${n.sodium_mg}mg)`);
  if (n.cholesterol_mg >= 300) reasons.push(`High cholesterol (${n.cholesterol_mg}mg)`);

  return {
    isHealthy: reasons.length === 0,
    reasons: reasons.length > 0 ? reasons : ["No health issues found"],
  };
}

// 🔹 Step 5: OCR Runner
export async function runOCR(imageBuffer) {
  const processed = await sharp(imageBuffer)
    .resize(1000)
    .grayscale()
    .toBuffer();

  const { data } = await getWorker().recognize(processed);

  console.log("=== OCR RAW TEXT ===");
  console.log(data.text);

  const cleaned = cleanText(data.text || "");
  console.log("=== OCR CLEANED TEXT ===");
  console.log(cleaned);

  const ingredients = parseIngredients(cleaned);
  const nutrition = parseNutrition(cleaned);
  const { isHealthy, reasons } = healthCheck(nutrition);

  return {
    productName: "Unknown Product",
    ingredients,
    nutrition_per_100g: nutrition,
    isHealthy,
    reasons,
  };
}
