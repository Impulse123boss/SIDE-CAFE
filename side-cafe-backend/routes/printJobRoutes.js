// routes/printJobRoutes.js
import express from 'express';
import multer from 'multer';
import { createPrintJob } from '../controllers/printJobController.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post('/print-jobs', upload.single('file'), createPrintJob);

export default router;
