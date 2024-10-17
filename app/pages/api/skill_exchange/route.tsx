import { NextApiRequest, NextApiResponse } from 'next';
import dbconfig from '../../dbconfig'; 
import SkillExchange from '../../models/SkillExchange'; 
import { withFilterSortPagination } from '../../middlewares/FilterSort';

interface CustomError extends Error {
  message: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbconfig();

  switch (req.method) {
    case 'GET':
      await withFilterSortPagination(req, res, async () => {
        const skills = await res.getModelList(SkillExchange);
        const details = await res.getModelListDetails(SkillExchange);

        return res.status(200).json({
          error: false,
          data: skills,
          message: 'SkillExchange list',
          details,
        });
      });
      break;

    case 'POST':
      try {
        const skill = await SkillExchange.create(req.body);
        const details = await res.getModelListDetails(SkillExchange);

        return res.status(201).json({
          error: false,
          data: skill,
          message: 'SkillExchange created',
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

        const skill = await SkillExchange.findByIdAndDelete(id);

        if (!skill) return res.status(404).json({ error: true, message: 'SkillExchange not found' });

        const details = await res.getModelListDetails(SkillExchange);

        return res.status(200).json({
          error: false,
          data: skill,
          message: 'SkillExchange deleted',
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