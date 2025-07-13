// src/screens/Preview.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import './Preview.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export default function Preview() {
  const location = useLocation();
  const navigate = useNavigate();
  const [numPages, setNumPages] = useState(null);
  const [selectedPages, setSelectedPages] = useState([]);

  const { file, printMode } = location.state || {};

  useEffect(() => {
    if (file && numPages) {
      const allPages = Array.from({ length: numPages }, (_, i) => i + 1);
      setSelectedPages(allPages); // default to all selected
    }
  }, [numPages, file]);

  const handleDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleCheckboxChange = (pageNumber) => {
    setSelectedPages((prev) =>
      prev.includes(pageNumber)
        ? prev.filter((n) => n !== pageNumber)
        : [...prev, pageNumber]
    );
  };

  const handleContinue = () => {
    if (printMode === 'color') {
      navigate('/color-selection', { state: { file, selectedPages } });
    } else {
      navigate('/summary', { state: { file, selectedPages } });
    }
  };

  if (!file) return <div>No file found.</div>;

  return (
    <div className="preview-container">
      <h2>Select Pages to Print</h2>
      <Document
        file={file}
        onLoadSuccess={handleDocumentLoadSuccess}
        onLoadError={(err) => {
          console.error('Error loading PDF:', err);
          alert('Failed to load PDF. Please make sure it is a valid PDF file.');
        }}
      >
        {Array.from(new Array(numPages), (_, index) => (
          <div key={index} className="page-item">
            <Page pageNumber={index + 1} width={250} />
            <label>
              <input
                type="checkbox"
                checked={selectedPages.includes(index + 1)}
                onChange={() => handleCheckboxChange(index + 1)}
              />
              Page {index + 1}
            </label>
          </div>
        ))}
      </Document>
      <button onClick={handleContinue} className="preview-btn">Continue</button>
    </div>
  );
}
