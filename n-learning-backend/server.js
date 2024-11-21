const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const { body, validationResult } = require("express-validator");
const lessonsRoutes = require("../n-learning-backend/routes/lessons");
const ordersRoutes = require("../n-learning-backend/routes/orders");
const Lesson = require("./models/Lesson");
const Order = require("./models/Order");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5000", credentials: true })); // Adjust frontend port

// Serve static files from the public folder
app.use(express.static("../public"));

// Order creation route
app.post(
  "/",
  [
    body("lessonId")
      .isInt({ gt: 0 })
      .withMessage("Lesson ID must be a positive integer"),
    body("quantity")
      .isInt({ gt: 0 })
      .withMessage("Quantity must be a positive integer"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { lessonId, quantity } = req.body;

      // Validate the lesson exists in the lessons collection
      const lesson = await Lesson.findOne({ id: lessonId });
      if (!lesson) {
        return res.status(404).json({ error: "Lesson not found" });
      }

      // Check if enough spaces are available
      if (lesson.spaces < quantity) {
        return res.status(400).json({ error: "Not enough spaces available" });
      }

      // Update the spaces in the lesson
      lesson.spaces -= quantity;
      await lesson.save();

      // Create and save the order
      const newOrder = new Order({
        lessonId,
        quantity,
        totalPrice: lesson.price * quantity,
        status: "confirmed", // Default order status
      });

      await newOrder.save();

      // Return success response
      res.status(200).json({
        message: "Order placed successfully!",
        order: newOrder,
      });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// API routes
app.use("/lessons", lessonsRoutes);
app.use("/orders", ordersRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
