import pool from '../models/db.js';
import multer from 'multer';
import path from 'path';

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
export const upload = multer({ storage });

export const createPrintJob = async (req, res) => {
  try {
    const {
      printMode,
      selectedPages,
      colorPages,
      totalPages,
      copies,
      duplex,
    } = req.body;

    const filename = req.file.filename;
    const color_pages = colorPages ? colorPages.split(',').map(Number) : [];
    const bw_pages = selectedPages
      .split(',')
      .map(Number)
      .filter((p) => !color_pages.includes(p));

    const result = await pool.query(
      `INSERT INTO print_jobs (filename, color_pages, bw_pages, total_pages, copies, duplex)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [filename, color_pages, bw_pages, parseInt(totalPages), parseInt(copies), duplex === 'true']
    );

    res.status(201).json({ message: 'Print job received', jobId: result.rows[0].id });
  } catch (err) {
    console.error('Failed to save print job:', err);
    res.status(500).json({ error: 'Failed to save print job' });
  }
};
