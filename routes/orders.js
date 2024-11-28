const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Lesson = require('../models/Lesson');  // Import the Lesson model (adjust path if necessary)

// Handle POST request to create an order
router.post('/', async (req, res) => {
  try {
    const { name, phone, lessonIDs, spaces } = req.body;

    // Ensure that all lesson IDs are valid and exist in the database
    const lessons = await Lesson.find({ '_id': { $in: lessonIDs } });

    if (lessons.length !== lessonIDs.length) {
      return res.status(400).json({ message: 'Some lessons were not found' });
    }

    // Create the order
    const newOrder = new Order({
      name,
      phone,
      lessons: lessons.map(lesson => lesson._id), // Store lesson IDs in the order
      spaces, // Number of spaces ordered
    });

    // Save the order to the database
    await newOrder.save();

    res.status(201).json({
      message: 'Order successfully created',
      order: newOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating order' });
  }
});

module.exports = router;

