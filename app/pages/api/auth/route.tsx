import { NextApiRequest, NextApiResponse } from 'next'
import User from '../../models/User';
import { pwEncrypt } from '@/app/helpers/pwEncrypt';
import { setToken } from '@/app/helpers/setToken';
import cookie from 'cookie';
import dbconfig from '@/dbconfig';

interface CustomError extends Error {
  message: string
}

export const login = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbconfig();
  const { method } = req;
  if (method === 'POST') {
    try {
      const { email, password } = req.body;
      if (email && password) {
        const user = await User.findOne({ email });
        if (user) {
          const match = await pwEncrypt.compare(password, user.password);
          if (user.isActive) {
            if (match) {
              const token = setToken(user);
              res.setHeader('Set-Cookie', cookie.serialize('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'strict',
                maxAge: 3600,
              }));
              return res.status(200).json({
                error: false,
                data: user,
                token: token,
                message: 'User logged in',
              });
            }
          }
        }
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      const err = error as CustomError;
      return res.status(400).json({ error: true, message: err.message });
    }
  }
}

export const logout = async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Set-Cookie', cookie.serialize('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    expires: new Date(0),
  }));
  return res.status(200).json({
    error: false,
    message: 'User logged out',
  });
}