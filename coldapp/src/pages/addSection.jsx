import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaFileAlt, FaTimes } from 'react-icons/fa';
const BASE_URL = process.env.REACT_APP_BASE_URL; // Adjust the import for your BASE_URL based on the config setup

export default function AddSection() {
  const navigate = useNavigate();
  const [sectionName, setSectionName] = useState('');
  const [file, setFile] = useState(null);

  // Function to pick a file using an HTML input
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Function to handle section creation
  const handleCreateSection = async () => {
    if (!sectionName || !file) {
      alert('Please enter a section name and upload a file');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('sectionName', sectionName);
      formData.append('file', file);

      const token = localStorage.getItem('token'); // Use localStorage for web

      if (!token) {
        alert('User is not authenticated');
        return;
      }

      const response = await axios.post(`${BASE_URL}/addSection`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.data.status === 'ok') {
        alert('Section created successfully');
        setSectionName('');
        setFile(null);
        navigate(-1); // Go back to the previous page
      } else {
        alert(response.data.message || 'Failed to create section');
      }
    } catch (error) {
      console.error('Upload Error:', error.message || error);
      alert(error.response?.data?.message || 'An error occurred while creating the section');
    }
  };

  // Function to remove the selected file
  const removeFile = () => {
    setFile(null);
    alert('The selected file has been removed.');
  };

  return (
    <div className="flex flex-col p-6 bg-gray-100 min-h-screen">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="flex items-center mb-6 text-blue-950">
        <FaArrowLeft size={30} />
      </button>

      {/* Title */}
      <h1 className="text-2xl font-bold text-blue-950">Create New Section</h1>

      {/* Section Name Input */}
      <div className="mt-4">
        <label htmlFor="section-name" className="text-lg text-blue-950">Section Name:</label>
        <input
          id="section-name"
          placeholder="Enter Section Name"
          value={sectionName}
          onChange={(e) => setSectionName(e.target.value)}
          className="w-full bg-white text-black rounded-md p-4 m-1 shadow mb-6 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-950"
        />
      </div>

      {/* File Upload Button */}
      <div className="flex justify-center items-center">
        <label htmlFor="file-upload" className="w-44 bg-blue-200 m-1 shadow rounded-md px-2 py-2 text-center text-lg text-blue-950 cursor-pointer mb-4 font-semibold hover:text-white hover:bg-blue-950">
          
          <span>Upload File</span>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept=".xlsx, .xls" // Restrict file types to Excel formats
          />
        </label>
      </div>

      {/* Display Selected File */}
      {file && (
        <div className="w-80 m-2 bg-gray-200 rounded-md p-4 mb-6 flex justify-between items-center shadow-md">
          <div className="flex items-center">
            <FaFileAlt size={20} className="text-blue-900 mr-2" />
            <p className="text-gray-700 text-lg">{file.name}</p>
          </div>
          <button onClick={removeFile} className="bg-red-500 p-2 rounded-full">
            <FaTimes size={20} color="white" />
          </button>
        </div>
      )}

      {/* Create Section Button */}
      <div className="flex justify-center items-center">
        <button
          onClick={handleCreateSection}
          className="w-44 bg-blue-950 m-1 shadow rounded-md px-2 py-2 text-center text-lg text-white cursor-pointer font-semibold hover:text-blue-950 hover:bg-blue-200"
        >
          Create Section
        </button>
      </div>
    </div>
  );
}
