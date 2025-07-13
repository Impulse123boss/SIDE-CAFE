import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ColorSelection.css';

export default function ColorSelection() {
  const location = useLocation();
  const navigate = useNavigate();
  const { file, selectedPages, printMode } = location.state || {};

  const [colorPages, setColorPages] = useState([]);

  useEffect(() => {
    if (!file || !selectedPages) {
      alert('Missing file or page data. Returning to upload.');
      navigate('/upload');
    } else {
      setColorPages(selectedPages); // Default to all selected pages being colored
    }
  }, [file, selectedPages, navigate]);

  const handleCheckboxChange = (page) => {
    setColorPages((prev) =>
      prev.includes(page) ? prev.filter((p) => p !== page) : [...prev, page]
    );
  };

  const handleContinue = () => {
    navigate('/summary', {
      state: {
        file,
        selectedPages,
        colorPages,
        printMode,
      },
    });
  };

  return (
    <div className="color-selection-container">
      <h2>Select Pages to Print in Color</h2>
      <ul className="color-page-list">
        {selectedPages.map((page) => (
          <li key={page}>
            <label>
              <input
                type="checkbox"
                checked={colorPages.includes(page)}
                onChange={() => handleCheckboxChange(page)}
              />
              Page {page}
            </label>
          </li>
        ))}
      </ul>
      <button onClick={handleContinue}>Continue</button>
    </div>
  );
}
