require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const seedDefaultExams = require('./seeds/examSeed');

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    await seedDefaultExams();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

start();
