const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');

router.get('/', async (req, res) => {
  try {
    const lessons = await Lesson.find();
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
