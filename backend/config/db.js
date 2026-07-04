const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  mongoose.set("strictQuery", true);
  if (isConnected) {
    console.log("=> Using existing database connection");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MongoDB_URI);

    isConnected = db.connections[0].readyState;
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.log("Err in DB Connection:", error.message);
  }
};

module.exports = connectDB;
