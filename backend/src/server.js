require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const seedDefaultExams = require('./seeds/examSeed');

const PORT = process.env.PORT || 5000;

// Listen to unhandled exceptions and rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err);
  process.exit(1);
});

const start = async () => {
  try {
    await connectDB();
    await seedDefaultExams();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();

