import express from 'express';
import { protect } from '../middleware/auth.js';
import { isAdmin } from '../middleware/admin.js';
import {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
    getMyJobs
} from '../controllers/jobController.js';

const router = express.Router();

router.use(protect);

router.get('/', getAllJobs);
router.post('/', createJob);
router.get('/my-jobs', getMyJobs);
router.get('/:id', getJobById);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob); // Owner or admin can delete

export default router;