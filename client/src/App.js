import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './screens/Login';
import Dashboard from './screens/Dashboard';
import Upload from './screens/Upload';
import Preview from './screens/Preview';
import ColorSelection from './screens/ColorSelection';
import Summary from './screens/Summary';
import PrintJobs from './screens/PrintJobs';
import PrintJobDetail from './screens/PrintJobDetails';


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/color-selection" element={<ColorSelection />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/jobs" element={<PrintJobs />} />
        <Route path="/print-job/:id" element={<PrintJobDetail />} />


        {/* Add more screens like /qr, /jobs, /machines here later */}
      </Routes>
    </Router>
  );
}
