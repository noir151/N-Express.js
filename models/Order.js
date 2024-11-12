const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  quantity: Number,
  // Add any other fields you need
});

module.exports = mongoose.model('Order', orderSchema);
