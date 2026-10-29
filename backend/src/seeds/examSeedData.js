const fs = require('fs');
const path = require('path');

// Load questions from exams.json
const jsonPath = path.join(__dirname, 'exams.json');
let defaultExams = [];

try {
  const fileContent = fs.readFileSync(jsonPath, 'utf8');
  defaultExams = JSON.parse(fileContent);
} catch (error) {
  console.error('Failed to load exams from exams.json:', error.message);
}

module.exports = defaultExams;
