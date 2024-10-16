import { NextApiRequest, NextApiResponse } from 'next';
import dbconfig from '../../dbconfig'; 
import Skill from '../../models/User'; 
import { withFilterSortPagination } from '../../middlewares/FilterSort';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    // Ensure DB is connected
    await dbconfig();

    switch (req.method) {
        case 'GET':
            
            await withFilterSortPagination(req, res, async () => {
                const skills = await res.getModelList(Skill);
                const details = await res.getModelListDetails(Skill);

                return res.status(200).json({
                    error: false,
                    data: skills,
                    message: 'Skill list',
                    details, 
                });
            });
            break;

        case 'POST':
            try {
                const skill = await Skill.create(req.body);

                const details = await res.getModelListDetails(Skill);

                return res.status(201).json({
                    error: false,
                    data: skill,
                    message: 'Skill created',
                    details, 
                });
            } catch (error) {
                return res.status(400).json({ error: true, message: error.message });
            }

        case 'DELETE':

            try {
                const id = req.query.id;

                if (!id) throw new Error('ID is required');

                const skill = await Skill.findByIdAndDelete(id);

                if (!skill) return res.status(404).json({ error: true, message: 'Skill not found' });

                const details = await res.getModelListDetails(Skill);

                return res.status(200).json({
                    error: false,
                    data: skill,
                    message: 'Skill deleted',
                    details, 
                });
            } catch (error) {
                return res.status(400).json({ error: true, message: error.message });
            }
            

        default:
            return res.status(405).json({ error: true, message: 'Method not allowed' });
    }
};