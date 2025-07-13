import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Summary.css';

export default function Summary() {
  const location = useLocation();
  const navigate = useNavigate();
  const { file, selectedPages, colorPages, printMode } = location.state || {};

  const handleConfirm = () => {
    alert('Print job confirmed! 🎉');
    navigate('/upload'); // Reset back to start
  };

  return (
    <div className="summary-container">
      <h2>Print Summary</h2>
      <p><strong>Print Mode:</strong> {printMode === 'color' ? 'Color' : 'Black & White'}</p>
      <p><strong>Total Pages Selected:</strong> {selectedPages?.length || 0}</p>
      {printMode === 'color' && (
        <p><strong>Pages to Print in Color:</strong> {colorPages?.join(', ')}</p>
      )}
      <button onClick={handleConfirm}>Confirm Print</button>
    </div>
  );
}
