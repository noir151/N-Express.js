const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const lessonsRoutes = require('./routes/lessons');
const ordersRoutes = require('./routes/orders');

dotenv.config();
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// API routes
app.use('/api/lessons', lessonsRoutes);
app.use('/api/orders', ordersRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const cors = require('cors');
app.use(cors());
