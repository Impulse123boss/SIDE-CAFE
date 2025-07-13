// src/screens/Upload.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Upload.css';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [printMode, setPrintMode] = useState('bw');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const uploaded = e.target.files[0];
    if (uploaded?.type === 'application/pdf') {
      setFile(uploaded);
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  const handleContinue = () => {
    if (!file) {
      alert('Please upload a file first.');
      return;
    }

    navigate('/preview', {
      state: { file, printMode }
    });
  };

  return (
    <div className="upload-container">
      <h2>Upload Your Document</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <div className="radio-options">
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
      <button className="upload-btn" onClick={handleContinue}>
        Continue
      </button>
    </div>
  );
}
