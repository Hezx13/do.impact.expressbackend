import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.CLOUD_DB_URI || "mongodb://localhost:27017/impact";

//const uri = 'mongodb://127.0.0.1:27017/local'; // Replace with your MongoDB URI
mongoose.connect(uri);

const dbConnect = () => {
    mongoose.connect(uri)
        .then(() => console.log('Connected to MongoDB...'))
        .catch(err => console.error('Could not connect to MongoDB...', err));
};

export default dbConnect;
