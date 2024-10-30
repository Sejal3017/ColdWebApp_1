import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom/client'; 
import App from './App';  
import './index.css';
import coldIcon from './icons/cold.png';

// Render the App component inside the root element of index.html
// Get the root element from the DOM
const rootElement = document.getElementById('root');

// Ensure the root element exists before creating the root
if (rootElement) {
  // Use ReactDOM.createRoot instead of ReactDOM.render
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

export default function Welcome() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      if (token) {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    };

    // Set a timer to check login status after 3 seconds (fade-in)
    const timer = setTimeout(() => {
      checkLoginStatus();
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen bg-black">
       <div className="text-center">
      <img
        src={coldIcon}  // Adjust path if needed
        alt="App Logo"
        className="w-20 h-20 mx-auto mb-4"
      />
      <h1 className="text-4xl text-white font-bold mt-5">Welcome!</h1></div>
    </div>
  );
}
