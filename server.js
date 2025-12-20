
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
      rejectUnauthorized: false
  }
});

db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
  } else {
    console.log('Connected to MySQL database successfully.');
    
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS participants (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255),
        school_name VARCHAR(255),
        city VARCHAR(100),
        email VARCHAR(100),
        phone VARCHAR(20),
        gender VARCHAR(20),
        grades_handled VARCHAR(100),
        subjects_handled VARCHAR(100),
        quiz_passed BOOLEAN DEFAULT FALSE,
        certificate_downloaded BOOLEAN DEFAULT FALSE,
        registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    connection.query(createTableQuery, (err) => {
        if(err) console.error("Error creating table:", err);
        connection.release();
    });
  }
});

app.post('/api/register', (req, res) => {
  const { fullName, schoolName, city, email, phone, gender, gradesHandled, subjectsHandled } = req.body;

  const sql = `
    INSERT INTO participants (full_name, school_name, city, email, phone, gender, grades_handled, subjects_handled) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [fullName, schoolName, city, email, phone, gender, gradesHandled, subjectsHandled], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error during registration' });
    }
    res.json({ id: result.insertId, message: 'User registered successfully' });
  });
});

app.patch('/api/update/:id', (req, res) => {
  const { id } = req.params;
  const { quizPassed, certificateDownloaded } = req.body;

  let fields = [];
  let values = [];

  if (quizPassed !== undefined) {
    fields.push('quiz_passed = ?');
    values.push(quizPassed);
  }
  if (certificateDownloaded !== undefined) {
    fields.push('certificate_downloaded = ?');
    values.push(certificateDownloaded);
  }

  if (fields.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  values.push(id);
  const sql = `UPDATE participants SET ${fields.join(', ')} WHERE id = ?`;

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database update failed' });
    }
    res.json({ message: 'Status updated successfully' });
  });
});

app.get('/api/participants', (req, res) => {
  const sql = 'SELECT * FROM participants ORDER BY id DESC';
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database fetch error' });
    }
    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
