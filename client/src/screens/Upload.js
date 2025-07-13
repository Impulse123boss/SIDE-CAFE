import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Upload.css';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [printMode, setPrintMode] = useState('bw');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const uploaded = e.target.files[0];
    if (!uploaded) return;

    // ✅ Check file type
    if (uploaded.type !== 'application/pdf') {
      alert('Only PDF files are supported.');
      return;
    }

    setFile(uploaded);
  };

  const handleContinue = () => {
    if (!file) {
      alert('Please upload a file first.');
      return;
    }

    localStorage.setItem('printMode', printMode);

    if (printMode === 'bw') {
      navigate('/summary', { state: { file, printMode } });
    } else {
      navigate('/preview', { state: { file, printMode } });
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Document</h2>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
      />

      <div className="upload-options">
        <label>
          <input
            type="radio"
            name="mode"
            value="bw"
            checked={printMode === 'bw'}
            onChange={() => setPrintMode('bw')}
          />
          Black & White
        </label>
        <label>
          <input
            type="radio"
            name="mode"
            value="color"
            checked={printMode === 'color'}
            onChange={() => setPrintMode('color')}
          />
          Color
        </label>
      </div>

      <button className="upload-button" onClick={handleContinue}>
        Continue
      </button>
    </div>
  );
}
