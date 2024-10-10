import { NextApiRequest, NextApiResponse } from 'next';
import dbconfig from '../../dbconfig'; 
import User from '../../models/User'; 
import { withFilterSortPagination } from '../../middlewares/FilterSort';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbconfig(); // Ensure DB is connected

  switch (req.method) {
    case 'GET':
      await withFilterSortPagination(req, res, async () => {
        const users = await res.getModelList(User);
        const details = await res.getModelListDetails(User);
        return res.status(200).json({
          error: false,
          data: users,
          message: 'User list',
          details,
        });
      });
      break;

    case 'POST':
      try {
        const user = await User.create(req.body);
        const details = await res.getModelListDetails(User);
        return res.status(201).json({
          error: false,
          data: user,
          message: 'User created',
          details,
        });
      } catch (error) {
        return res.status(400).json({ error: true, message: error.message });
      }

    case 'DELETE':
      try {
        const id = req.query.id;
        if (!id) throw new Error('ID is required');
        const user = await User.findByIdAndDelete(id);
        if (!user) return res.status(404).json({ error: true, message: 'User not found' });
        const details = await res.getModelListDetails(User);
        return res.status(200).json({
          error: false,
          data: user,
          message: 'User deleted',
          details,
        });
      } catch (error) {
        return res.status(400).json({ error: true, message: error.message });
      }

    default:
      return res.status(405).json({ error: true, message: 'Method not allowed' });
  }
};

export default handler;
