const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  lessons: [
    {
      lessonId: { type: Number, required: true },
      quantity: { type: Number, required: true },
      totalPrice: { type: Number, required: true },
    },
  ],
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
