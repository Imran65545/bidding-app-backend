
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bidRoutes = require('./routes/bidRoutes');
require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use('/api/bids', bidRoutes);

console.log(process.env.MONGO_URI);  // Log the MONGO_URI to check if it's loaded


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
