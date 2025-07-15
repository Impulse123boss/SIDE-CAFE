import { pool } from '../models/db.js';
import multer from 'multer';
import path from 'path';

// ✅ Setup file storage
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.random().toString(36).substring(2, 15) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

export const upload = multer({ storage }).single('file');

// ✅ POST: Create new print job
export const createPrintJob = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ success: false, error: 'No file uploaded' });

    const {
      printMode,
      selectedPages,
      colorPages,
      totalPages,
      copies,
      duplex: duplexRaw,
    } = req.body;

    // ✅ Parse values properly
    const selected = selectedPages.split(',').map(n => parseInt(n));
    const color = colorPages ? colorPages.split(',').map(n => parseInt(n)) : [];
    const bw = selected.filter(p => !color.includes(p));
    const duplex = duplexRaw === 'true' || duplexRaw === true;

    // ✅ Insert into DB
    const result = await pool.query(
      `INSERT INTO print_jobs
        (filename, color_pages, bw_pages, total_pages, copies, duplex, status)
       VALUES
        ($1, $2, $3, $4, $5, $6, 'pending')
       RETURNING *`,
      [file.filename, color, bw, totalPages, copies, duplex]
    );

    return res.status(201).json({ success: true, job: result.rows[0] });

  } catch (err) {
    console.error('Print job submission error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// ✅ GET: Fetch all jobs
export const getAllPrintJobs = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM print_jobs ORDER BY created_at DESC');
    res.json({ success: true, jobs: result.rows });
  } catch (err) {
    console.error('Error fetching jobs:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// ✅ GET: Fetch one job by ID
export const getPrintJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM print_jobs WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }
    res.json({ success: true, job: result.rows[0] });
  } catch (err) {
    console.error('Error fetching job:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
