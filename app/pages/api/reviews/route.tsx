import { NextApiRequest, NextApiResponse } from 'next';
import dbconfig from '../../dbconfig'; 
import Reviews from '../../models/Reviews'; 
import { withFilterSortPagination } from '../../middlewares/FilterSort';

interface CustomError extends Error {
  message: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbconfig(); 

  switch (req.method) {
    case 'GET':
      await withFilterSortPagination(req, res, async () => {
        try {
          const reviews = await res.getModelList(Reviews);
          const details = await res.getModelListDetails(Reviews);
          return res.status(200).json({
            error: false,
            data: reviews,
            message: 'Review list',
            details,
          });
        } catch (error) {
          const err = error as CustomError;
          return res.status(400).json({ error: true, message: err.message });
        }
      });
      break;

    case 'POST':
      try {
        const review = await Reviews.create(req.body);
        const details = await res.getModelListDetails(Reviews);
        return res.status(201).json({
          error: false,
          data: review,
          message: 'Review created',
          details,
        });
      } catch (error) {
        const err = error as CustomError;
        return res.status(400).json({ error: true, message: err.message });
      }

    case 'DELETE':
      try {
        const { id } = req.query;
        if (!id) throw new Error('ID is required');
        const review = await Reviews.findByIdAndDelete(id);
        if (!review) return res.status(404).json({ error: true, message: 'Review not found' });
        const details = await res.getModelListDetails(Reviews);
        return res.status(200).json({
          error: false,
          data: review,
          message: 'Review deleted',
          details,
        });
      } catch (error) {
        const err = error as CustomError;
        return res.status(400).json({ error: true, message: err.message });
      }

    default:
      return res.status(405).json({ error: true, message: 'Method not allowed' });
  }
};

export default handler;