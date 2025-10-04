import express from 'express';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import {
    getAllAlumni,
    getAlumniById,
    getMyProfile,
    updateMyProfile,
    uploadProfilePicture,
    deleteProfilePicture,
    searchAlumni,
    getAlumniByBatch,
    getAlumniByIndustry
} from '../controllers/alumniController.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Alumni search and listing
router.get('/', getAllAlumni);
router.post('/search', searchAlumni);
router.get('/batch/:year', getAlumniByBatch);
router.get('/industry/:industry', getAlumniByIndustry);

// Profile management
router.get('/profile/me', getMyProfile);
router.put('/profile/me', updateMyProfile);
router.post('/profile/upload-picture', upload.single('profilePicture'), uploadProfilePicture);
router.delete('/profile/delete-picture', deleteProfilePicture);

// Single alumni
router.get('/:id', getAlumniById);

export default router;