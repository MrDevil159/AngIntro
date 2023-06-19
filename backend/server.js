const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3000; // You can choose any available port

app.use(express.json()); // Built-in JSON body parsing middleware
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/products')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);
