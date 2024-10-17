import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/app/helpers/setToken'; // Adjust the import path as needed

const authMiddleware = (handler: Function) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: true, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = verifyToken(token);
      req.user = decoded; 
      return handler(req, res); 
    } catch (error) {
      return res.status(401).json({ error: true, message: 'Invalid token' });
    }
  };
};

export default authMiddleware;