const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  subject: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  spaces: { type: Number, required: true },
  image: { type: String, required: true },
});

const Lesson = mongoose.model('Lesson', lessonSchema);
module.exports = Lesson;
