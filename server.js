import express from "express";
import api from './routes/index.js';
import dotenv from 'dotenv';
import mongoose from "mongoose";
import cors from "cors";

// Load environment variables
dotenv.config();

// MongoDB connection setup using Mongoose
const connectToDB = async () => {
    try {
        // Mongoose connection with retry mechanism
        await mongoose.connect(process.env.MONGODB_PATH, {
            useNewUrlParser: true,  // Use new URL parser
            useUnifiedTopology: true,  // Use unified topology
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.log('Error connecting to MongoDB:', error.message);
        process.exit(1);  // Exit the process in case of connection failure
    }
};

// Connect to MongoDB
connectToDB();

// Server Configuration
const PORT = process.env.SERVER_PORT || 9003;
const origin = process.env.CORS_ORIGIN || 'http://localhost:3000';

const app = express();

// CORS Setup
app.use(cors({
    origin
}));

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));  // Add the 'extended' option

// Define a root route to avoid "Cannot GET /" error
app.get('/', (req, res) => {
    res.send('Welcome to the Project Management API!');
});

// API Routes
app.use('/api', api);  // Ensure routes are prefixed with /api

// Start the Express Server
app.listen(PORT, () => {
    console.log(`Your app is running on http://localhost:${PORT}`);
});

