import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import loginIcon from '../icons/login.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
// Replace AsyncStorage with localStorage for the web
const BASE_URL = process.env.REACT_APP_BASE_URL; 

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate(); // Use useNavigate for web navigation

  useEffect(() => {
    const checkLoggedIn = () => {
      const token = localStorage.getItem('token');
      if (token) {
        navigate('/dashboard');
      }
    };
    checkLoggedIn();
  }, [navigate]);

  const handleLogin = async () => {
    console.log(BASE_URL)
    if (!email || !password) {
      alert('Error: Please fill in both fields');
      return;
    }

    setLoading(true);
    const userData = { email, password };

    try {
      const res = await axios.post(`${BASE_URL}/login-user`, userData);

      if (res.data.status === 'ok') {
        alert('Login Successful');

        // Store token and user session details in localStorage
        localStorage.setItem('token', res.data.data); // Store JWT token
        localStorage.setItem('isLoggedIn', 'true');

        // Navigate after successful login
        setTimeout(() => {
          setLoading(false);
          navigate('/dashboard');
        }, 1000);
      } else {
        setLoading(false);
        alert(`Login Failed: ${res.data.message || 'Invalid credentials'}`);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error during login:', error);
      if (error.response) {
        alert(`Login Failed: ${error.response.data.message || 'Invalid credentials'}`);
      } else {
        alert('Error: Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 ">
      <div className="w-full max-w-md p-8 space-y-5 bg-white rounded-xl shadow-md">
        <div className="flex justify-center">
          <img src={loginIcon} alt="Login Icon" className="w-40 h-40" />
        </div>
        <h1 className="text-3xl font-bold text-center  text-blue-950 ">LOG IN</h1>

        <div className="space-y-4">
          {/* Email Input */}
          <div className="relative">
            <input
              type="email"
              className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-950"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-950"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-4 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash size={20} color="gray" /> : <FaEye size={20} color="gray" />}
            </button>
          </div>

          {/* Login Button */}
          <div className="flex justify-center">
            <button
              className={`w-40 p-3 rounded-md text-white font-bold ${loading ? 'bg-gray-400' : 'bg-blue-950 hover:bg-blue-200 hover:text-stone-800'}`}
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'LOGIN'}
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="flex justify-center">
            <p className="text-center text-gray-700">
              Don't have an account?{' '}
              <span
                className="text-blue-950 underline cursor-pointer hover:text-blue-300"
                onClick={() => navigate('/register')}
              >
                SIGN UP
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
