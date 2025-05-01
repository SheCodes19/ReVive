const express = require('express');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Create database
const db = new sqlite3.Database('./users.db', (err) => {
  if (err) console.error(err.message);
  console.log("Connected to the SQLite database.");
});

// Create users table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT
);`);

app.use(express.json());
app.use(express.static('public'));

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true
}));

// SIGNUP route
app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  console.log("Signup request received:", username, password);

  if (!username || !password) {
    console.log("Missing fields");
    return res.status(400).send('Username and password required');
  }

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (err) {
      console.error('DB error checking user:', err);
      return res.status(500).send('Error checking user');
    }

    if (row) {
      console.log("Username already exists:", username);
      return res.status(400).send('Username already exists');
    }

    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err) => {
      if (err) {
        console.error('Error inserting user:', err);
        return res.status(500).send('Error inserting user');
      }

      console.log("User successfully created:", username);
      res.status(200).send('User created successfully');
    });
  });
});

// LOGIN route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
    if (err) return res.status(500).send('Login error');
    if (row) {
      req.session.username = username;
      res.status(200).send('Login successful');
    } else {
      res.status(401).send('Invalid username or password');
    }
  });
});

// CHECK-LOGIN route
app.get('/check-login', (req, res) => {
  if (req.session.username) {
    res.json({ loggedIn: true, username: req.session.username });
  } else {
    res.json({ loggedIn: false });
  }
});

// LOGOUT route
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send('Logout error');
    res.clearCookie('connect.sid');
    res.status(200).send('Logged out');
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
