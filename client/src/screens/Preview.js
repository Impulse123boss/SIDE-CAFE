// ✅ src/screens/Preview.js
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import './Preview.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export default function Preview() {
  const location = useLocation();
  const navigate = useNavigate();
  const [numPages, setNumPages] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [selectedPages, setSelectedPages] = useState([]);
  const [colorPages, setColorPages] = useState([]);

  const file = location.state?.file;
  const printMode = location.state?.printMode || 'bw';

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setFileUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [file]);

  const handleDocumentLoad = ({ numPages }) => {
    setNumPages(numPages);
    const allPages = Array.from({ length: numPages }, (_, i) => i + 1);
    setSelectedPages(allPages);
    setColorPages(printMode === 'color' ? allPages : []);
  };

  const handlePageSelect = (pageNum) => {
    setSelectedPages((prev) =>
      prev.includes(pageNum) ? prev.filter((p) => p !== pageNum) : [...prev, pageNum]
    );
  };

  const handleColorSelect = (pageNum) => {
    setColorPages((prev) =>
      prev.includes(pageNum) ? prev.filter((p) => p !== pageNum) : [...prev, pageNum]
    );
  };

  const handleSelectAll = () => {
    const all = Array.from({ length: numPages }, (_, i) => i + 1);
    setSelectedPages(all);
    if (printMode === 'color') setColorPages(all);
  };

  const handleClearAll = () => {
    setSelectedPages([]);
    if (printMode === 'color') setColorPages([]);
  };

  const handleContinue = () => {
    navigate('/summary', {
      state: {
        file,
        selectedPages,
        colorPages: printMode === 'color' ? colorPages : [],
        printMode,
      },
    });
  };

  if (!fileUrl) return <div className="loading-message">Loading PDF...</div>;

  return (
    <div className="preview-container">
      <h2>Select Pages to Print</h2>
      <div className="preview-controls">
        <button onClick={handleSelectAll}>Select All</button>
        <button onClick={handleClearAll}>Clear All</button>
      </div>

      <Document file={fileUrl} onLoadSuccess={handleDocumentLoad}>
        <div className="preview-grid">
          {Array.from({ length: numPages }, (_, i) => {
            const pageNum = i + 1;
            return (
              <div key={pageNum} className="preview-page-box">
                <Page pageNumber={pageNum} width={200} />
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedPages.includes(pageNum)}
                    onChange={() => handlePageSelect(pageNum)}
                  />
                  Page {pageNum}
                </label>
                {printMode === 'color' && selectedPages.includes(pageNum) && (
                  <label className="color-checkbox-label">
                    <input
                      type="checkbox"
                      checked={colorPages.includes(pageNum)}
                      onChange={() => handleColorSelect(pageNum)}
                    />
                    <span style={{ color: '#1565c0' }}>Print in Color</span>
                  </label>
                )}
              </div>
            );
          })}
        </div>
      </Document>

      <button onClick={handleContinue} className="preview-continue-button">Continue</button>
    </div>
  );
}
