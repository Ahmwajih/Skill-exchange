import jwt, { JwtPayload } from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET as string;
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET as string;

export const generateToken = (payload: JwtPayload) => {
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, { expiresIn: '7d' });
  return { token, refreshToken };
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET_KEY);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_SECRET_KEY);
};

