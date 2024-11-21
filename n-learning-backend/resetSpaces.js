const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Lesson = require("./models/Lesson"); // Adjust the path to your Lesson model

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const resetSpaces = async () => {
  try {
    const result = await Lesson.updateMany({}, { $set: { spaces: 5 } });
    console.log(`Spaces reset for ${result.modifiedCount} lessons`);
  } catch (error) {
    console.error("Error resetting spaces:", error);
  } finally {
    mongoose.disconnect(); // Ensure the connection closes after the script runs
  }
};

resetSpaces();
