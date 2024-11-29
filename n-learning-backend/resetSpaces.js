const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Lesson = require("./models/Lesson"); 

dotenv.config();

//[------ Connects to MongoDB URI ------]
mongoose
  .connect(process.env.MONGODB_URI) // No options needed for mongoose 6.x and above
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

  //[------ Function to reset the spaces for all lessons in the database ------]
const resetSpaces = async () => {
  try {
    const result = await Lesson.updateMany({}, { $set: { spaces: 5 } });
    console.log(`Spaces reset for ${result.modifiedCount} lessons`);
  } catch (error) {
    console.error("Error resetting spaces:", error);
  } finally {
    mongoose.disconnect();
  }
};

resetSpaces();
