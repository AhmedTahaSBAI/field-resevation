const express = require('express');
const router = express.Router();
const db = require('../db/config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = 'your_jwt_secret';

// Login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, users) => {
    if (err) return res.status(500).send('Database error');
    if (users.length === 0) return res.status(401).send('Invalid credentials');

    const user = users[0];
    bcrypt.compare(password, user.password, (err, match) => {
      if (err || !match) return res.status(401).send('Invalid credentials');

      const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '1h' });
      res.json({ token, role: user.role });
    });
  });
});

// Middleware to check token
const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('No token provided');

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(403).send('Invalid token');
    req.user = decoded;
    next();
  });
};

module.exports = { authRouter: router, authenticate };
