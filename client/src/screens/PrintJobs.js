import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './PrintJobs.css';

function formatPageRanges(pages) {
  if (!pages || pages.length === 0) return 'None';
  const sorted = [...pages].sort((a, b) => a - b);
  const ranges = [];
  let start = sorted[0], end = sorted[0];
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === end + 1) {
      end = sorted[i];
    } else {
      ranges.push(start === end ? `${start}` : `${start}-${end}`);
      start = end = sorted[i];
    }
  }
  ranges.push(start === end ? `${start}` : `${start}-${end}`);
  return ranges.join(', ');
}

function truncateFileName(name, maxLen = 20) {
  if (!name) return '';
  return name.length > maxLen ? name.slice(0, maxLen) + '...' : name;
}

export default function PrintJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const JOBS_PER_PAGE = 5;

  // Dynamically get backend URL (adjust this as needed)
  const BACKEND_URL = `http://${window.location.hostname}:5000`;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/print-jobs`);
        if (!response.ok) throw new Error('Failed to fetch jobs');
        const data = await response.json();
        if (data.success) {
          setJobs(data.jobs);
        } else {
          throw new Error('No jobs received');
        }
      } catch (err) {
        console.error('❌ Error fetching jobs:', err);
        setError('Could not connect to backend.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const totalPages = Math.ceil(jobs.length / JOBS_PER_PAGE);
  const paginatedJobs = jobs.slice((page - 1) * JOBS_PER_PAGE, page * JOBS_PER_PAGE);

  if (loading) return <div className="printjobs-container">Loading print jobs...</div>;
  if (error) return <div className="printjobs-container">{error}</div>;
  if (jobs.length === 0) return <div className="printjobs-container">No print jobs submitted yet.</div>;

  return (
    <div className="printjobs-container">
      <h2>Submitted Print Jobs</h2>
      <div className="printjobs-table-wrapper">
        <table className="printjobs-table">
          <thead>
            <tr>
              <th style={{ width: '140px' }}>File</th>
              <th style={{ width: '120px' }}>Color Pages</th>
              <th style={{ width: '120px' }}>B/W Pages</th>
              <th style={{ width: '70px' }}>Copies</th>
              <th style={{ width: '70px' }}>Duplex</th>
              <th style={{ width: '90px' }}>Status</th>
              <th style={{ width: '140px' }}>Created</th>
            </tr>
          </thead>
          <tbody>
            {paginatedJobs.map((job) => (
              <tr key={job.id} className="printjob-card">
                <td>
                  <Link to={`/print-job/${job.id}`}>
                    {truncateFileName(job.filename)}
                  </Link>
                </td>
                <td>{formatPageRanges(job.color_pages)}</td>
                <td>{formatPageRanges(job.bw_pages)}</td>
                <td>{job.copies}</td>
                <td>{job.duplex ? 'Yes' : 'No'}</td>
                <td>{job.status}</td>
                <td>{new Date(job.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="printjobs-pagination">
        <button
          className="printjobs-page-btn"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >Previous</button>
        <span className="printjobs-page-info">Page {page} of {totalPages}</span>
        <button
          className="printjobs-page-btn"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >Next</button>
      </div>
    </div>
  );
}
