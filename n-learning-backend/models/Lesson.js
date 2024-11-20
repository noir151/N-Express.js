const mongoose = require('mongoose');

// Define the lesson schema
const lessonSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  spaces: { type: Number, required: true },
  image: { type: String, required: true },
});

// Export the model
module.exports = mongoose.model('Lesson', lessonSchema);
