import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaChevronRight, FaBars, FaArrowLeft, FaPlus } from 'react-icons/fa';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    mobile: '',
  });
  const [menuVisible, setMenuVisible] = useState(false);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    getUserData();
    getSections();
  }, []);

  const getUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('User is not authenticated');
        return;
      }

      const response = await axios.post(`${BASE_URL}/userdata`, { token });
      if (response.data.status === 'ok') {
        const { name, email, mobile } = response.data.data;
        setUserData({ name, email, mobile });
      } else {
        alert(response.data.message || 'Failed to fetch user data');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while fetching user data');
    }
  };

  const getSections = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('User is not authenticated');
        return;
      }

      const response = await axios.get(`${BASE_URL}/sections`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 'ok') {
        setSections(response.data.data);
      } else {
        alert(response.data.message || 'Failed to fetch sections');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while fetching sections');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  const getBackgroundColor = (index) => {
    if (index % 3 === 0) return 'bg-purple-200';
    if (index % 3 === 1) return 'bg-amber-200';
    return 'bg-blue-200';
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <nav className="fixed top-0 left-0 right-0 z-10 flex justify-between items-center bg-blue-950 text-white p-6 shadow-lg">
        <button onClick={() => setMenuVisible(!menuVisible)} className="focus:outline-none">
          <FaBars size={30} />
        </button>
        <button
          onClick={() => navigate('/addSection')}
          className="flex items-center px-4 py-2 bg-blue-200 text-blue-950 rounded-md shadow font-semibold hover:text-white hover:bg-blue-300"
        >
          <span className="mr-2">Add Section</span>
          <FaPlus size={20} />
        </button>
      </nav>

      {menuVisible && (
        <div className="absolute inset-y-0 left-0 w-64 bg-blue-950 text-white p-6 z-10">
          <button className="flex items-center mb-8" onClick={() => setMenuVisible(false)}>
            <FaArrowLeft size={30} />
            <span className="ml-2 text-xl">Home</span>
          </button>
          <p className="text-gray-400 mb-2">Personal Information</p>
          <div className="space-y-4 mb-8">
            <div>
              <p className="text-lg font-bold">Email</p>
              <p className="text-white">{userData.email}</p>
            </div>
            <div>
              <p className="text-lg font-bold">Name</p>
              <p className="text-white">{userData.name}</p>
            </div>
            <div>
              <p className="text-lg font-bold">Mobile</p>
              <p className="text-white">{userData.mobile}</p>
            </div>
          </div>
          <p className="text-gray-400 mb-2">Security</p>
          <button className="w-full text-left mb-8 border-b border-gray-600 pb-2">Change Password</button>
          <button
            className="w-full bg-blue-200 text-blue-950 py-2 rounded-md shadow text-xl font-semibold hover:text-white hover:bg-blue-300"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}

      <div className="mt-24 p-6 overflow-y-auto flex-1">
        <h1 className="text-4xl font-bold text-blue-950 mb-6">Sections</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, index) => (
            <div
              key={section._id}
              className={`${getBackgroundColor(index)} p-4 rounded-lg shadow-lg flex justify-between items-center cursor-pointer`}
              onClick={() =>
                navigate('/sectionDetails', {
                  state: {
                    sectionName: section.sectionName,
                    studentNames: section.studentNames,
                    sectionId: section._id,
                  },
                })
              }
            >
              <div>
                <h2 className="text-xl font-bold text-blue-900 mb-1">{section.sectionName}</h2>
                <p className="text-lg text-blue-900">Students: {section.studentNames.length}</p>
              </div>
              <FaChevronRight size={28} className="text-blue-900" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
