const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Expecting: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'devsecret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden: Invalid token' });
    }

    // console.log("Decoded JWT payload:", user); // <-- Removed this noisy log

    req.user = {
      userId: user.userId || user.id || user._id
    };

    next();
  });
}

module.exports = authenticateToken;







