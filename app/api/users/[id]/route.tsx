import { NextApiRequest, NextApiResponse } from 'next';
import dbconfig from '../../../api/'; 
import User from '../../models/User'; 
import { withFilterSortPagination } from '../../../middlewares/FilterSort';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    // Ensure DB is connected
    await dbconfig();

    switch (req.method) {
        case 'GET':
            
            await withFilterSortPagination(req, res, async () => {
                const { id } = req.query;  
                const user = await User.findById(id);

                if (!user) return res.status(404).json({ error: true, message: 'User not found' });

               
                const details = await res.getModelListDetails(User);

                return res.status(200).json({
                    error: false,
                    data: user,
                    message: 'User details',
                    details, 
                });
            });
            break;

        case 'PUT':
            try {
                const { id } = req.query;  

                if (!id) throw new Error('ID is required');
                const user = await User.findByIdAndUpdate(id, req.body, { new: true });

                if (!user) return res.status(404).json({ error: true, message: 'User not found' });

               
                const details = await res.getModelListDetails(User);

                return res.status(200).json({
                    error: false,
                    data: user,
                    message: 'User updated',
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
