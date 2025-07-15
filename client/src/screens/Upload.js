// src/screens/Upload.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pdfjs } from 'react-pdf';
import './Upload.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export default function Upload() {
  const [file, setFile] = useState(null);
  const [printMode, setPrintMode] = useState('bw');
  const [pageSelection, setPageSelection] = useState('all');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const uploaded = e.target.files[0];
    if (uploaded && uploaded.type === 'application/pdf') {
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

    localStorage.setItem('printMode', printMode);

    if (pageSelection === 'specific') {
      navigate('/preview', { state: { file, printMode } });
    } else {
      const reader = new FileReader();
      reader.onload = function () {
        const typedArray = new Uint8Array(this.result);
        pdfjs.getDocument(typedArray).promise.then((pdf) => {
          const allPages = Array.from({ length: pdf.numPages }, (_, i) => i + 1);
          const colorPages = printMode === 'color' ? allPages : [];

          navigate('/summary', {
            state: { file, printMode, selectedPages: allPages, colorPages },
          });
        });
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="upload-card">
      <h2 className="card-title">Upload Document</h2>
      <div className="card-section">
        <label htmlFor="file-upload" className="file-label">Select PDF file</label>
        <input
          id="file-upload"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="file-input"
        />
      </div>

      <div className="card-section">
        <div className="option-group">
          <span className="option-label">Print Mode:</span>
          <input
            type="radio"
            id="mode-bw"
            name="mode"
            value="bw"
            checked={printMode === 'bw'}
            onChange={() => setPrintMode('bw')}
            className="hidden-radio"
          />
          <label
            htmlFor="mode-bw"
            className={`toggle-label${printMode === 'bw' ? ' selected' : ''}`}
          >
            B/W
          </label>
          <input
            type="radio"
            id="mode-color"
            name="mode"
            value="color"
            checked={printMode === 'color'}
            onChange={() => setPrintMode('color')}
            className="hidden-radio"
          />
          <label
            htmlFor="mode-color"
            className={`toggle-label${printMode === 'color' ? ' selected' : ''}`}
          >
            Color
          </label>
        </div>
      </div>

      <div className="card-section">
        <div className="option-group">
          <span className="option-label">Pages:</span>
          <input
            type="radio"
            id="pages-all"
            name="pages"
            value="all"
            checked={pageSelection === 'all'}
            onChange={() => setPageSelection('all')}
            className="hidden-radio"
          />
          <label
            htmlFor="pages-all"
            className={`toggle-label${pageSelection === 'all' ? ' selected' : ''}`}
          >
            Print all pages
          </label>
          <input
            type="radio"
            id="pages-specific"
            name="pages"
            value="specific"
            checked={pageSelection === 'specific'}
            onChange={() => setPageSelection('specific')}
            className="hidden-radio"
          />
          <label
            htmlFor="pages-specific"
            className={`toggle-label${pageSelection === 'specific' ? ' selected' : ''}`}
          >
            Select specific pages
          </label>
        </div>
      </div>

      <button className="upload-button" onClick={handleContinue}>
        Continue
      </button>
    </div>
  );
}
