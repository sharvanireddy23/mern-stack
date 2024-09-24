require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB connection SUCCESS");
    } catch (error) {
        console.log("MongoDB connection FAIL");
        console.error(error);
        process.exit(1);
    }
};

module.exports = connectDB;
