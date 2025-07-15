// ✅ src/screens/PrintJobDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PrintJobDetails.css';

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

export default function PrintJobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [error, setError] = useState(null);

  const BACKEND_URL = `http://${window.location.hostname}:5000`;

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/print-jobs/${id}`);
        const data = await res.json();
        if (data.success) {
          setJob(data.job);
        } else {
          setError('Print job not found.');
        }
      } catch (err) {
        console.error('Error fetching job:', err);
        setError('Unable to connect to backend.');
      }
    };
    fetchJob();
  }, [id]);

  if (error) return <div className="detail-container">{error}</div>;
  if (!job) return <div className="detail-container">Loading job...</div>;

  return (
    <div className="detail-container">
      <h2>Print Job Details</h2>
      <div className="detail-card">
        <p><strong>File:</strong> {job.filename}</p>
        <p><strong>Status:</strong> {job.status}</p>
        <p><strong>Created At:</strong> {new Date(job.created_at).toLocaleString()}</p>
        <p><strong>Total Pages:</strong> {job.total_pages}</p>
        <p><strong>Color Pages:</strong> {formatPageRanges(job.color_pages)}</p>
        <p><strong>B/W Pages:</strong> {formatPageRanges(job.bw_pages)}</p>
        <p><strong>Copies:</strong> {job.copies}</p>
        <p><strong>Duplex:</strong> {job.duplex ? 'Yes' : 'No'}</p>
      </div>
      <button onClick={() => navigate(-1)} className="detail-back">Back</button>
    </div>
  );
}
