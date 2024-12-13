
import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import Contact from '@/models/Contact';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { fullName, email, message } = req.body;

    if (!fullName || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      const newContact = new Contact({ fullName, email, message });
      await newContact.save();

      return res.status(201).json({ message: 'Contact saved successfully' });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
};

export default handler;