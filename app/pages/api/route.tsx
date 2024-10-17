import connectDB from '../../lib/db'; 
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('Request method:', req.method); // Log the request method
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }
  
    try {
      await connectDB(); // Ensure the database connection is established
      res.status(200).json({ message: 'Database connection successful!' });
    } catch (error) {
      res.status(500).json({ message: 'Database connection failed', error: (error as Error).message });
    }
  }
  
