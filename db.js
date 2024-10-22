// db.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const DATABASE_URL = 'mongodb+srv://aryanmaurya698:fMiYwdrCr06CSl72@proteineats.kir4b.mongodb.net/PROTEIN_EATS?retryWrites=true&w=majority';

export default async function connectToDatabase() {
  try {
    await mongoose.connect(DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, 
      socketTimeoutMS: 30000,
    });
    // Suppress the deprecation warning for strictQuery
    mongoose.set("strictQuery", false);

    console.log("\n-- --Connected to the MongoDB Atlas database Successfully-- --");
    return mongoose.connection;
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error.message);
    throw error;
  }
}
