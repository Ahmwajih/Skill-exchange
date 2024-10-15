import { NextApiRequest, NextApiResponse } from 'next';
import dbconfig from '../../dbconfig';
import Token from '../../models/Token';
import { withFilterSortPagination } from '../../middlewares/FilterSort';

interface CustomError extends Error {
  message: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbconfig();

  switch (req.method) {
    case 'GET':
      await withFilterSortPagination(req, res, async () => {
        const tokens = await res.getModelList(Token);
        const details = await res.getModelListDetails(Token);

        return res.status(200).json({
          error: false,
          data: tokens,
          message: 'Token list',
          details,
        });
      });
      break;

    case 'POST':
      try {
        const token = await Token.create(req.body);
        const details = await res.getModelListDetails(Token);

        return res.status(201).json({
          error: false,
          data: token,
          message: 'Token created',
          details,
        });
      } catch (error) {
        const err = error as CustomError;
        return res.status(400).json({ error: true, message: err.message });
      }

    case 'DELETE':
      try {
        const id = req.query.id;

        if (!id) throw new Error('ID is required');

        const token = await Token.findByIdAndDelete(id);

        if (!token) return res.status(404).json({ error: true, message: 'Token not found' });

        const details = await res.getModelListDetails(Token);

        return res.status(200).json({
          error: false,
          data: token,
          message: 'Token deleted',
          details,
        });
      } catch (error) {
        const err = error as CustomError;
        return res.status(400).json({ error: true, message: err.message });
      }
  }
};  


export default handler;