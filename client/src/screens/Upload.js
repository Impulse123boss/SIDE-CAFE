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
      // Load the PDF to get total number of pages and send them
      const reader = new FileReader();
      reader.onload = function () {
        const typedArray = new Uint8Array(this.result);
        pdfjs.getDocument(typedArray).promise.then((pdf) => {
          const allPages = Array.from({ length: pdf.numPages }, (_, i) => i + 1);
          navigate('/summary', {
            state: { file, printMode, selectedPages: allPages },
          });
        });
      };
      reader.readAsArrayBuffer(file);
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

      <div className="option-row">
        <div className="option-group">
          <label className="radio-option">
            <input
              type="radio"
              name="mode"
              value="bw"
              checked={printMode === 'bw'}
              onChange={() => setPrintMode('bw')}
            />
            B/W
          </label>
          <label className="radio-option">
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

        <div className="option-group pages">
          <label className="radio-option">
            <input
              type="radio"
              name="pages"
              value="all"
              checked={pageSelection === 'all'}
              onChange={() => setPageSelection('all')}
            />
            Print all pages
          </label>
          <label className="radio-option">
            <input
              type="radio"
              name="pages"
              value="specific"
              checked={pageSelection === 'specific'}
              onChange={() => setPageSelection('specific')}
            />
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
