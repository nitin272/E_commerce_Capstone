import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; // Your logo image
import { Button } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning'; // Importing an icon from Material UI

const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-red-50 to-red-200">
      <img src={logo} alt="Logo" className="h-[20vh] w-auto mb-8" />
      <div className="flex items-center mb-6">
        <WarningIcon className="text-red-600 text-5xl mr-2 animate-bounce" />
        <h1 className="font-serif text-4xl font-bold text-red-700">Oops!</h1>
      </div>
      <p className="text-lg text-gray-700 mb-5 text-center animate-fadeIn">
        It seems like you need to log in first to access this page.
      </p>
      <Button
        variant="contained"
        className="bg-red-600 hover:bg-red-700 transition duration-300 text-white w-48 shadow-lg rounded-lg transform hover:scale-105"
        size="large"
        onClick={() => navigate('/')}
      >
        Back to Home
      </Button>

      {/* Inline Styles for Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Error;
