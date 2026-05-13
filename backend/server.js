require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json()); // Allows parsing JSON bodies

// --- STUDENTS ENDPOINTS ---

// Get all students
app.get('/api/students', (req, res) => {
  const query = 'SELECT * FROM students';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Add a new student
app.post('/api/students', (req, res) => {
  const { id, name, class_name, section, transport_route } = req.body;
  const query = 'INSERT INTO students (id, name, class_name, section, transport_route) VALUES (?, ?, ?, ?, ?)';
  
  db.query(query, [id, name, class_name, section, transport_route], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Student added successfully', studentId: id });
  });
});

// Basic Root Route
app.get('/', (req, res) => {
  res.send('Skolux ERP API is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
