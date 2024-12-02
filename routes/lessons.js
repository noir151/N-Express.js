const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson'); 

  // Route to get all lessons 
router.get('/lessons', async (req, res) => {
  try {
    const lessons = await Lesson.find(); // [------ Fetchs all lessons from the database ------]
    res.json(lessons); // [------ Sends the lessons as a response ------]
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

