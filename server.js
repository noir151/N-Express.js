const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const lessonsRoutes = require('../n-learning-backend/routes/lessons');
const ordersRoutes = require('../n-learning-backend/routes/orders');
const Lesson = require('./models/Lesson');
const Order = require('./models/Order');


dotenv.config();
const app = express();
app.use(express.json());

// Middleware to serve static files from the public folder
app.use(express.static('../public'));

// Middleware for parsing JSON and logging
app.use(express.json());

app.post('/', async (req, res) => {
  const { name, phone, lessonIDs, spaces } = req.body;

  try {
    // Fetch the ObjectIds for the provided lessonIDs
    const lessons = await Lesson.find({ id: { $in: lessonIDs } }); // `id` matches the numeric ID in the lessons
    const lessonObjectIds = lessons.map(lesson => lesson._id); // Extract the ObjectIds

    // Create the new order
    const order = new Order({
      name,
      phone,
      lessonIDs: lessonObjectIds, // Use ObjectIds instead of plain numbers
      spaces,
    });

    await order.save();

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error });
  }
});


// MongoDB connection (ensure you use the correct URI)
mongoose.connect(process.env.MONGODB_URI, {
  authSource: 'Cluster51',
  authMechanism: 'SCRAM-SHA-1'
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// API routes
app.use('../n-learning-backend/routes/lessons', lessonsRoutes);
app.use('../n-learning-backend/routes/orders', ordersRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const cors = require('cors');
app.use(cors());



