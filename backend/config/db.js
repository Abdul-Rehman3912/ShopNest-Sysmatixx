const mongoose = require("mongoose");

const connectDB = async (req, res) => {
  try {
    const connection = await mongoose.connect(process.env.MongoDB_URI);
    console.log("MongoDB connected!");
  } catch (error) {
    console.log("Err in DB Connection", error);
  }
};

module.exports = connectDB;
