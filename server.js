const express = require('express');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 3000;
const db = new Database(path.join(__dirname, 'students.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    gender TEXT NOT NULL,
    date_of_birth TEXT NOT NULL,
    email TEXT NOT NULL COLLATE NOCASE UNIQUE,
    phone TEXT NOT NULL,
    course TEXT NOT NULL,
    address TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

app.use(express.json({ limit: '20kb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/register', (req, res) => {
  const fields = ['fullName', 'gender', 'dateOfBirth', 'email', 'phone', 'course', 'address'];
  const data = {};
  for (const field of fields) {
    data[field] = typeof req.body[field] === 'string' ? req.body[field].trim() : '';
  }

  const missing = fields.filter((field) => !data[field]);
  if (missing.length) {
    return res.status(400).json({ message: 'Please complete all required fields.', fields: missing });
  }
  if (data.fullName.length < 2 || data.fullName.length > 100) {
    return res.status(400).json({ message: 'Full name must be between 2 and 100 characters.', fields: ['fullName'] });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return res.status(400).json({ message: 'Enter a valid email address.', fields: ['email'] });
  }
  if (!/^[+()\d\s.-]{7,20}$/.test(data.phone)) {
    return res.status(400).json({ message: 'Enter a valid phone number.', fields: ['phone'] });
  }
  if (!['Female', 'Male', 'Prefer not to say'].includes(data.gender)) {
    return res.status(400).json({ message: 'Choose a valid gender option.', fields: ['gender'] });
  }
  if (data.address.length > 300) {
    return res.status(400).json({ message: 'Address must be 300 characters or fewer.', fields: ['address'] });
  }

  try {
    const result = db.prepare(`INSERT INTO students
      (full_name, gender, date_of_birth, email, phone, course, address)
      VALUES (@fullName, @gender, @dateOfBirth, @email, @phone, @course, @address)`)
      .run(data);
    return res.status(201).json({ message: 'Registration saved successfully.', studentId: result.lastInsertRowid });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ message: 'That email address is already registered.', fields: ['email'] });
    }
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong while saving your registration. Please try again.' });
  }
});

// Demo endpoint for checking that the API is running; does not expose student records.
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => console.log(`Student Registration Portal running at http://localhost:${PORT}`));
