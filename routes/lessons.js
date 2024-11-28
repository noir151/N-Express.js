const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson'); // Import the Lesson model

// Route to get all lessons
router.get('/', async (req, res) => {
  try {
    const lessons = await Lesson.find(); // Fetch all lessons from the database
    res.json(lessons); // Send the lessons as a response
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
