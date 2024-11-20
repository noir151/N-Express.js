const mongoose = require('mongoose');

// Define the order schema
const orderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }], // Store lesson references
    spaces: { type: Number, required: true },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt timestamps
);

// Export the model
module.exports = mongoose.model('Order', orderSchema);
