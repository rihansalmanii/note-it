const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB Connected");
    console.log("Database:", mongoose.connection.name);
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDB;
