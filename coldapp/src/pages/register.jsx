import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // Use react-icons for validation icons
import addUser from '../icons/add-user.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000'; // Adjust the base URL for your backend

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [nameVerify, setNameVerify] = useState(false);
  const [email, setEmail] = useState('');
  const [emailVerify, setEmailVerify] = useState(false);
  const [mobile, setMobile] = useState('');
  const [mobileVerify, setMobileVerify] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordVerify, setPasswordVerify] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    setLoading(true);
    const userData = { name, email, mobile, password };
    if (nameVerify && emailVerify && passwordVerify && mobileVerify) {
      try {
        const res = await axios.post(`${BASE_URL}/register`, userData);
        if (res.data.status === 'ok') {
          alert('Registration Successful');
          setTimeout(() => {
            setLoading(false);
            navigate('/login'); // Navigate to login after successful registration
          }, 2000);
        } else {
          alert(JSON.stringify(res.data));
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        alert('Registration failed');
        setLoading(false);
      }
    } else {
      alert('Please fill in all details correctly.');
      setLoading(false);
    }
  };

  const handleName = (text) => {
    setName(text);
    setNameVerify(text.length > 1); // Validate name length
  };

  const handleEmail = (text) => {
    setEmail(text);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailVerify(emailRegex.test(text)); // Validate email format
  };

  const handlePassword = (text) => {
    setPassword(text);
    setPasswordVerify(text.length >= 6); // Validate password length
  };

  const handleMobile = (text) => {
    setMobile(text);
    const mobileRegex = /^[0-9]{10}$/;
    setMobileVerify(mobileRegex.test(text)); // Validate mobile number length
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-md">
        {/* Image */}
        <div className="flex justify-center mb-6">
          <img src={addUser} alt="Add User Icon" className="w-20 h-20" />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-blue-900 mb-6">SIGN UP</h2>

        {/* Name Input */}
        <div className="mb-4">
          <div className="flex items-center bg-gray-100 p-3 rounded-lg">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => handleName(e.target.value)}
              className="flex-grow bg-transparent outline-none"
            />
            {name.length > 0 && (nameVerify ? <FaCheckCircle color="green" /> : <FaTimesCircle color="red" />)}
          </div>
          {name.length > 0 && !nameVerify && <p className="text-red-500 text-xs mt-1">Name should be longer than 1 character.</p>}
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <div className="flex items-center bg-gray-100 p-3 rounded-lg">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => handleEmail(e.target.value)}
              className="flex-grow bg-transparent outline-none"
            />
            {email.length > 0 && (emailVerify ? <FaCheckCircle color="green" /> : <FaTimesCircle color="red" />)}
          </div>
          {email.length > 0 && !emailVerify && <p className="text-red-500 text-xs mt-1">Please enter a valid email address.</p>}
        </div>

        {/* Mobile Input */}
        <div className="mb-4">
          <div className="flex items-center bg-gray-100 p-3 rounded-lg">
            <input
              type="text"
              placeholder="Mobile"
              value={mobile}
              onChange={(e) => handleMobile(e.target.value)}
              className="flex-grow bg-transparent outline-none"
            />
            {mobile.length > 0 && (mobileVerify ? <FaCheckCircle color="green" /> : <FaTimesCircle color="red" />)}
          </div>
          {mobile.length > 0 && !mobileVerify && <p className="text-red-500 text-xs mt-1">Mobile number must be 10 digits.</p>}
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <div className="flex items-center bg-gray-100 p-3 rounded-lg">
            <input
              type={showPassword ? 'text' : 'password'} // Toggle between text and password
              placeholder="Password"
              value={password}
              onChange={(e) => handlePassword(e.target.value)}
              className="flex-grow bg-transparent outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
              className="ml-2 focus:outline-none"
            >
              {showPassword ? <FaEyeSlash color="gray" /> : <FaEye color="gray" />}
            </button>
          </div>
          {password.length > 0 && !passwordVerify && <p className="text-red-500 text-xs mt-1">Password should be at least 6 characters.</p>}
        </div>


        {/* Register Button */}
        <div className="flex justify-center">
        <button
          className="w-40 bg-blue-950 text-white p-3 rounded-md font-bold hover:bg-blue-200 hover:text-stone-800 transition duration-200"
          
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? 'Registering...' : 'REGISTER'}
        </button></div>

        {/* Already have an account? */}
        <p className="text-center text-blue-950 mt-4">
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            className="underline font-semibold cursor-pointer hover:text-blue-300"
          >
            LOG IN
          </span>
        </p>
      </div>
    </div>
  );
}