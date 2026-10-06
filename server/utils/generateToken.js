const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'rentease_super_secret_jwt_key_2026', {
    expiresIn: '7d',
  });
};

module.exports = generateToken;
