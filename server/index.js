const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/myapp';

mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
