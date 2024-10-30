import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaTrashAlt } from 'react-icons/fa'; // Use react-icons for icons

const BASE_URL = process.env.REACT_APP_BASE_URL; // Adjust the import for your BASE_URL based on the config setup

export default function SectionDetails() {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract parameters passed through `navigate` state
  const { sectionName, studentNames = [], sectionId } = location.state || {};
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');

  // Generate a random student from the list
  const generateRandomStudent = () => {
    if (studentNames.length === 0) {
      setSelectedStudent('No students available');
    } else {
      const randomIndex = Math.floor(Math.random() * studentNames.length);
      setSelectedStudent(studentNames[randomIndex]);
    }
    setModalVisible(true);
  };

  // Handle the section deletion process
  const handleDeleteSection = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this section?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('User is not authenticated');
        return;
      }

      const response = await axios.delete(`${BASE_URL}/deleteSection/${sectionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status === 'ok') {
        alert('Section deleted successfully');
        navigate('/dashboard');
      } else {
        alert(response.data.message || 'Failed to delete section');
      }
    } catch (error) {
      console.error('Deletion Error:', error.message || error);
      alert('An error occurred while deleting the section');
    }
  };

  return (
    <div className="relative min-h-screen bg-white">
  {/* Fixed Header */}
  <div className="fixed top-0 left-0 w-full bg-gray-100 z-10 p-6 shadow">
    {/* Back Button */}
    <button onClick={() => navigate(-1)} className="flex items-center mb-4 text-blue-950">
      <FaArrowLeft size={30} />
    </button>

    {/* Section Title and Delete Button */}
    <div className="flex justify-between items-center ">
      <h1 className="text-4xl font-bold text-blue-950">{sectionName}</h1>
      <button onClick={handleDeleteSection}>
        <FaTrashAlt size={28} className="text-red-600" />
      </button>
    </div>
  </div>

  {/* Scrollable Student List */}
  <div className="pt-36 px-6 pb-24 overflow-hidden"> {/* Adjusted padding to prevent overlap */}
    {studentNames.length > 0 ? (
      studentNames.map((name, index) => (
        <div key={index} className="bg-blue-100 rounded-md p-4 mb-2 shadow">
          <p className="text-blue-900 font-bold text-lg">{name}</p>
        </div>
      ))
    ) : (
      <p className="text-blue-900 text-lg">No students available in this section.</p>
    )}
  </div>

  {/* Fixed Footer */}
  <div className="fixed bottom-0 left-0 w-full bg-gray-100 p-4 shadow-lg z-10">
    <div className="w-full flex justify-center">
      <button
        onClick={generateRandomStudent}
        className="w-72 bg-blue-950 rounded-md p-4 text-white text-xl font-bold hover:text-blue-950 hover:bg-blue-200"
      >
        Generate Random Student
      </button>
    </div>
  </div>

  {/* Modal for Random Student */}
  {modalVisible && (
    <div className="fixed inset-0 text-center flex justify-center items-center bg-black/60">
      <div className="w-80 bg-white rounded-lg p-6 items-center shadow-lg">
        <h2 className="text-xl font-bold text-blue-900 mb-4">Student Selected</h2>
        <p className="text-3xl text-gray-700 mb-6">{selectedStudent}</p>
        <button onClick={() => setModalVisible(false)} className="bg-blue-950 rounded-md px-6 py-3 text-white">
          Close
        </button>
      </div>
    </div>
  )}
</div>

  );
}
