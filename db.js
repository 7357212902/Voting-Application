const mongoose = require("mongoose");
//require('dotenv').config();

const mongoURL = "mongodb://127.0.0.1:27017/voting";
//const MONGODB_URL = process.env.MONGODB_URL;

//const mongoURL = 'mongodb+srv://krishjain2902:krish123@cluster0.9h8yfvd.mongodb.net/'

// Set up MongoDB connection with proper error handling
mongoose
    .connect(mongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to MongoDB server");
    })
    .catch((err) => {
        console.error("Initial MongoDB connection error:", err);
    });

// Define event listener for database connection
const db = mongoose.connection;

db.on("connected", () => {
    console.log("Mongoose connected to MongoDB");
});

db.on("error", (err) => {
    console.error("Mongoose connection error:", err);
});

db.on("disconnected", () => {
    console.log("Mongoose disconnected from MongoDB");
});

// Handle process termination signals to gracefully close the MongoDB connection
process.on("SIGINT", async() => {
    await mongoose.connection.close();
    console.log("Mongoose disconnected on app termination");
    process.exit(0);
});

process.on("SIGTERM", async() => {
    await mongoose.connection.close();
    console.log("Mongoose disconnected on app termination");
    process.exit(0);
});

// Export the database connection
module.exports = db;