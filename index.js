// src/index.js
import connectDB from './src/config/db.js';
import dotenv from 'dotenv';
import app from './app.js';
dotenv.config();


connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});