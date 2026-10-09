
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error(
      'JWT_SECRET is missing. Please check your backend .env file.'
    );
  }

  return jwt.sign(
    { id },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
  );
};

export default generateToken;