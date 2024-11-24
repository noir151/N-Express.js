const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const { body, validationResult } = require("express-validator");
const lessonsRoutes = require("../n-learning-backend/routes/lessons");
const ordersRoutes = require("../n-learning-backend/routes/orders");
const Lesson = require("./models/Lesson");
const Order = require("./models/Order");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5000", credentials: true })); // Adjust frontend port if needed

// Serve static files from the public folder
app.use(express.static("../public"));

// Order creation route
app.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("phone").isMobilePhone().withMessage("Phone number is required and must be valid"),
    body("lessons").isArray({ min: 1 }).withMessage("Lessons must be an array."),
    body("lessons.*.lessonId").isInt({ gt: 0 }).withMessage("Lesson ID must be a positive integer."),
    body("lessons.*.quantity").isInt({ gt: 0 }).withMessage("Quantity must be a positive integer."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, phone, lessons } = req.body;

      // Create a new order object
      const order = new Order({
        name,
        phone,
        lessons: [],
        status: "confirmed", // Default status
      });

      // Process each lesson in the order
      for (const lessonData of lessons) {
        const lesson = await Lesson.findOne({ id: lessonData.lessonId });
        if (!lesson) {
          return res.status(404).json({ error: `Lesson with ID ${lessonData.lessonId} not found` });
        }

        if (lesson.spaces < lessonData.quantity) {
          return res.status(400).json({
            error: `Not enough spaces for lesson ${lessonData.lessonId}`,
          });
        }

        // Update the spaces in the lesson
        lesson.spaces -= lessonData.quantity;
        await lesson.save();

        // Add this lesson to the order's lessons array
        order.lessons.push({
          lessonId: lessonData.lessonId,
          quantity: lessonData.quantity,
          totalPrice: lesson.price * lessonData.quantity,
        });
      }

      // Save the order to the database
      await order.save();

      // Return success response
      res.status(200).json({ message: "Order placed successfully!", order });
    } catch (error) {
      console.error("Error processing order:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  }
);

// MongoDB connection
const mongoURI = process.env.MONGODB_URI || "mongodb+srv://noir:noir@cluster51.3zm8d.mongodb.net/n-learning?authSource=Cluster51&authMechanism=SCRAM-SHA-1";

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }) // Connection options
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// API routes
app.use("/lessons", lessonsRoutes);
app.use("/orders", ordersRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
