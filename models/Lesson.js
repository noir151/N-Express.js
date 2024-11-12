const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  // Add any other fields you need
});

module.exports = mongoose.model('Lesson', lessonSchema);
