// ✅ src/screens/Summary.js
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Summary.css';

function formatPageRanges(pages) {
  if (!pages || pages.length === 0) return '';
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

export default function Summary() {
  const navigate = useNavigate();
  const location = useLocation();
  const { file, printMode, selectedPages, colorPages = [] } = location.state || {};
  const [copies, setCopies] = useState(1);
  const [isDuplex, setIsDuplex] = useState(false);

  if (!file || !selectedPages) {
    return <div className="summary-container">Missing print data.</div>;
  }

  const fileName = file.name || 'Untitled Document';
  const numPages = selectedPages.length;
  const colorCount = colorPages?.filter((p) => selectedPages.includes(p)).length || 0;
  const bwCount = numPages - colorCount;

  const handleConfirm = async () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('printMode', printMode);
    formData.append('selectedPages', selectedPages.join(','));
    formData.append('colorPages', colorPages.join(','));
    formData.append('totalPages', selectedPages.length);
    formData.append('copies', copies);
    formData.append('duplex', isDuplex);

    try {
      const response = await fetch('http://192.168.238.73:5000/print-jobs', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Print job failed');

      const result = await response.json();
      alert('✅ Print job submitted successfully!');
      console.log('Backend response:', result);
    } catch (error) {
      console.error('❌ Error submitting print job:', error);
      alert('Failed to submit print job.');
    }
  };

  return (
    <div className="summary-container">
      <h2>Print Summary</h2>
      <div className="summary-card">
        <p><strong>File:</strong> {fileName}</p>
        <p><strong>Print Mode:</strong> {printMode === 'bw' ? 'Black & White' : 'Color'}</p>
        <p><strong>Pages Selected:</strong> {formatPageRanges(selectedPages)}</p>
        <p><strong>Total Pages:</strong> {numPages}</p>
        {printMode === 'color' && (
          <>
            <p><strong>Pages in Color:</strong> {formatPageRanges(colorPages)}</p>
            <p><strong>Pages in B/W:</strong> {bwCount}</p>
          </>
        )}
        <div className="duplex-toggle">
          <button
            type="button"
            className={`duplex-btn${isDuplex ? ' selected' : ''}`}
            onClick={() => setIsDuplex((prev) => !prev)}
          >
            {isDuplex ? 'Duplex Printing: ON' : 'Duplex Printing: OFF'}
          </button>
        </div>
        <label className="copies-label">
          <strong>Number of Copies:</strong>
          <input
            type="number"
            value={copies}
            min={1}
            onChange={(e) => setCopies(Number(e.target.value))}
          />
        </label>
      </div>

      <div className="summary-buttons">
        <button className="back-button" onClick={() => navigate(-1)}>Back</button>
        <button className="confirm-button" onClick={handleConfirm}>Confirm Print</button>
      </div>
    </div>
  );
}
