// src/middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/user');


const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.sendStatus(403);
    }
    
    try {
      const user = await User.findByPk(decoded.userId);
      if (!user) {
        return res.sendStatus(401);
      }
      req.user = user; // Attach user object to request
      next();
    } catch (error) {
      res.sendStatus(500);
    }
  });
};

module.exports = authenticateToken;
