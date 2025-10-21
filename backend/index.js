const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/user.routes');
const projectRoutes = require('./routes/project.routes');
const cookieParser = require('cookie-parser');

require('dotenv').config();
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173", // frontend URL
  credentials: true,
}));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDB();

// Routes

app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 