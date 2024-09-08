const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config(); 

const app = express();
app.use(express.json());

function generateSecretKey() {
  return crypto.randomBytes(64).toString('hex');
}

let SECRET_KEY = process.env.JWT_SECRET || generateSecretKey();

console.log("Using secret key:", SECRET_KEY);

// Middleware function
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    req.user = user;
    next();
  });
}

app.post('/login', (req, res) => {
  const username = req.body.username;
  const user = { name: username };

  const token = jwt.sign(user, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Welcome to the protected route!', user: req.user });
});

app.get('/public', (req, res) => {
  res.json({ message: 'This is a public route!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
