import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.CLOUD_DB_URI || "mongodb://localhost:27017/impact";

//const uri = 'mongodb://127.0.0.1:27017/local'; // Replace with your MongoDB URI
mongoose.connect(uri);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

export default db;
