import mongoose from "mongoose";

mongoose.set("strictQuery", false);

const connectToMongoDb = async (url) => {
  try {
    await mongoose.connect(url);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectToMongoDb;
