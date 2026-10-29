require('dotenv').config();
const mongoose = require('mongoose');
const Exam = require('../models/Exam');
const defaultExams = require('./examSeedData');
const connectDB = require('../config/db');

const seedDefaultExams = async () => {
  try {
    const existingCount = await Exam.countDocuments();
    if (existingCount > 0) {
      console.log(`Database already has ${existingCount} exams. Ensuring default exams exist...`);
    }

    for (const examData of defaultExams) {
      const exists = await Exam.findOne({ title: examData.title });
      if (!exists) {
        await Exam.create(examData);
        console.log(`✓ Seeded exam: "${examData.title}"`);
      }
    }
    console.log('Exam seeding complete.');
  } catch (error) {
    console.error('Error seeding exams:', error.message);
    throw error;
  }
};

if (require.main === module) {
  (async () => {
    try {
      await connectDB();
      await seedDefaultExams();
      await mongoose.connection.close();
      process.exit(0);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  })();
}

module.exports = seedDefaultExams;
