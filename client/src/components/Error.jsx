import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; 
import { Button } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning'; 

const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-red-50 to-red-200 p-4">

      <img
        src={logo}
        alt="Logo"
        className="h-[15vh] w-auto mb-6 sm:h-[20vh]" 
      />

      <div className="flex items-center mb-4">
        <WarningIcon className="text-red-600 text-4xl mr-2 animate-bounce sm:text-5xl" />
        <h1 className="font-serif text-3xl font-bold text-red-700 sm:text-4xl lg:text-5xl">
          Oops!
        </h1>
      </div>

      <p className="text-base text-gray-700 mb-5 text-center sm:text-lg lg:text-xl animate-fadeIn">
        It seems like you need to log in first to access this page.
      </p>


      <Button
        variant="contained"
        className="bg-red-600 hover:bg-red-700 transition duration-300 text-white w-44 sm:w-48 lg:w-56 shadow-lg rounded-lg transform hover:scale-105"
        size="large"
        onClick={() => navigate('/')}
        style={{ padding: '10px 16px' }} 
      >
        Back to Home
      </Button>


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

        @media (max-width: 640px) {
          h1 {
            font-size: 2.5rem;
          }
          p {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Error;
