import type { NextApiRequest, NextApiResponse } from 'next';
import { Skill } from '../../models/Skill'; // Adjust the import according to your project structure
import { withFilterSortPagination } from '../../middleware';


interface CustomError extends Error {
    message: string;
  }
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  withFilterSortPagination(req, res, async () => {
    switch (req.method) {
      case 'GET':
        try {
          const { id } = req.query;

          if (!id) throw new Error('ID is required');
          const skill = await Skill.findById(id);

          if (!skill) return res.status(404).json({ error: true, message: 'Skill not found' });

          const details = await res.getModelListDetails(Skill);

          return res.status(200).json({
            error: false,
            data: skill,
            message: 'Skill details',
            details,
          });
        } catch (error) {
          const err = error as CustomError;
          return res.status(400).json({ error: true, message: err.message });
        }

      case 'PUT':
        try {
          const { id } = req.query;

          if (!id) throw new Error('ID is required');
          const skill = await Skill.findByIdAndUpdate(id, req.body, { new: true });

          if (!skill) return res.status(404).json({ error: true, message: 'Skill not found' });

          const details = await res.getModelListDetails(Skill);

          return res.status(200).json({
            error: false,
            data: skill,
            message: 'Skill updated',
            details,
          });
        } catch (error) {
          const err = error as CustomError;
          return res.status(400).json({ error: true, message: err.message });
        }

      default:
        return res.status(405).json({ error: true, message: 'Method not allowed' });
    }
  });
}