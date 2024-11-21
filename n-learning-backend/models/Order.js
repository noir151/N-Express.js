const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  lessonId: {
    type: Number, // Must match a lesson's ID in the lessons collection
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["confirmed", "cancelled"], // Example statuses
    default: "confirmed",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
