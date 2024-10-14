import { NextApiRequest, NextApiResponse } from 'next';
import dbconfig from '../../dbconfig'; 
import Reviews from '../../models/SkillExchange'; 
import { withFilterSortPagination } from '../../middlewares/FilterSort';

interface CustomError extends Error {
  message: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Ensure DB is connected
  await dbconfig();

  switch (req.method) {
    case 'GET':
      await withFilterSortPagination(req, res, async () => {
        try {
          const { id } = req.query;  
          const review = await Reviews.findById(id);

          if (!review) return res.status(404).json({ error: true, message: 'Review not found' });

          const details = await res.getModelListDetails(Reviews);

          return res.status(200).json({
            error: false,
            data: review,
            message: 'Review details',
            details, 
          });
        } catch (error) {
          const err = error as CustomError;
          return res.status(400).json({ error: true, message: err.message });
        }
      });
      break;

    case 'PUT':
      try {
        const { id } = req.query;  

        if (!id) throw new Error('ID is required');
        const review = await Reviews.findByIdAndUpdate(id, req.body, { new: true });

        if (!review) return res.status(404).json({ error: true, message: 'Review not found' });

        const details = await res.getModelListDetails(Reviews);

        return res.status(200).json({
          error: false,
          data: review,
          message: 'Review updated',
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