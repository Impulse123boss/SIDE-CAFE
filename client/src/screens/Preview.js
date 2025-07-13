import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.min';
import './Preview.css';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export default function Preview() {
  const location = useLocation();
  const navigate = useNavigate();
  const [pageImages, setPageImages] = useState([]);
  const [selectedPages, setSelectedPages] = useState([]);

  useEffect(() => {
    const loadPDF = async () => {
      const file = location.state?.file;
      if (!file) return alert('No file found.');

      const url = URL.createObjectURL(file);

      try {
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;

        const renderedPages = [];

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 0.5 });

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({ canvasContext: context, viewport }).promise;
          renderedPages.push({ pageNumber: i, image: canvas.toDataURL() });
        }

        setPageImages(renderedPages);
        setSelectedPages(renderedPages.map((p) => p.pageNumber));
      } catch (err) {
        console.error('PDF load failed:', err);
        alert('Failed to render PDF.');
      }
    };

    loadPDF();
  }, [location.state]);

  const togglePage = (pageNumber) => {
    setSelectedPages((prev) =>
      prev.includes(pageNumber)
        ? prev.filter((n) => n !== pageNumber)
        : [...prev, pageNumber]
    );
  };

  const handleContinue = () => {
    navigate('/summary', {
      state: {
        file: location.state.file,
        selectedPages,
      },
    });
  };

  return (
    <div className="preview-container">
      <h2>Select Pages to Print in Color</h2>
      <div className="preview-grid">
        {pageImages.map((page) => (
          <div key={page.pageNumber} className="preview-item">
            <img src={page.image} alt={`Page ${page.pageNumber}`} />
            <label>
              <input
                type="checkbox"
                checked={selectedPages.includes(page.pageNumber)}
                onChange={() => togglePage(page.pageNumber)}
              />
              Page {page.pageNumber}
            </label>
          </div>
        ))}
      </div>
      <button onClick={handleContinue}>Continue</button>
    </div>
  );
}
