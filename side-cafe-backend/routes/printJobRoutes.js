import express from 'express';
import {
  upload,
  createPrintJob,
  getAllPrintJobs,
  getPrintJobById,
} from '../controllers/printJobController.js';

const router = express.Router();

// POST: Create new print job with file upload
router.post('/print-jobs', upload, createPrintJob);

// GET: Fetch all submitted print jobs
router.get('/print-jobs', getAllPrintJobs);

// GET: Fetch a single print job by ID
router.get('/print-jobs/:id', getPrintJobById);

export default router;
