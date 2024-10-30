import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Welcome from './index';     // Import Welcome component
import Login from './pages/login';         // Import Login component
import Register from './pages/register';   // Import Register component
import Dashboard from './pages/dashboard'; // Import Dashboard component
import SectionDetails from './pages/sectionDetails';  // Import SectionDetails component
import AddSection from './pages/addSection';  // Import AddSection component

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Define routes for each component */}
        <Route path="/" element={<Welcome />} />          {/* Welcome page */}
        <Route path="/login" element={<Login />} />       {/* Login page */}
        <Route path="/register" element={<Register />} /> {/* Register page */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* Dashboard page */}
        <Route path="/addSection" element={<AddSection />} /> {/* Add Section page */}
        <Route path="/sectionDetails" element={<SectionDetails />} /> {/* Section Details page */}
      
      </Routes>
    </BrowserRouter>
  );
}

