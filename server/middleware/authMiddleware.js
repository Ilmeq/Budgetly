// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  console.log('Authorization header:', authHeader); // Log the authorization header

  const token = authHeader && authHeader.split(' ')[1]; // Expecting: "Bearer <token>"
  if (!token) {
    console.log('No token found in header'); // Log missing token
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'devsecret', (err, user) => {
    if (err) {
      console.log('Token verification error:', err); // Log verification error details
      return res.status(403).json({ error: 'Forbidden: Invalid token' });
    }
    console.log('Token valid, user:', user); // Log decoded token user data
    req.user = user; // user contains { userId: ... }
    next();
  });
}

module.exports = authenticateToken;





