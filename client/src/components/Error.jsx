import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { Button } from '@mui/material';
import { 
  Warning as WarningIcon, 
  Home as HomeIcon, 
  ShoppingCart, 
  Login, 
  ArrowForward 
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Error = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-800 to-slate-900"
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* Glowing Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 flex flex-col justify-center items-center min-h-screen p-4">
        {/* Logo Section */}
        <motion.div
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="mb-12"
        >
          <img
            src={logo}
            alt="Logo"
            className="h-[15vh] w-auto hover:scale-105 transition-transform duration-300 sm:h-[20vh] drop-shadow-2xl"
          />
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-8 sm:p-12 max-w-xl w-full mx-4 border border-white/20"
        >
          <div className="flex flex-col items-center text-center">
            {/* Animated Warning Icon */}
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, -5, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="mb-8"
            >
              <div className="bg-red-500/10 rounded-full p-6 border border-red-500/20">
                <WarningIcon className="text-red-400 text-6xl sm:text-7xl" />
              </div>
            </motion.div>

            {/* Error Message */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl sm:text-6xl font-bold text-white mb-6"
            >
              404
            </motion.h1>

            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4"
            >
              Access Denied
            </motion.h2>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg sm:text-xl text-gray-300 mb-12"
            >
              Please log in to continue shopping and access your account.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 w-full max-w-md"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1"
              >
                <Button
                  variant="contained"
                  startIcon={<Login />}
                  onClick={() => navigate('/login')}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 rounded-xl text-lg font-medium shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  Sign In
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1"
              >
                <Button
                  variant="outlined"
                  startIcon={<HomeIcon />}
                  onClick={() => navigate('/')}
                  className="w-full border-2 border-white/20 text-white hover:bg-white/5 px-8 py-3 rounded-xl text-lg font-medium backdrop-blur-sm transition-all duration-300"
                >
                  Home Page
                </Button>
              </motion.div>
            </motion.div>

            {/* Shopping Suggestion */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12 pt-8 border-t border-white/10"
            >
              <Button
                onClick={() => navigate('/products')}
                className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
              >
                <ShoppingCart className="group-hover:rotate-12 transition-transform duration-300" />
                Continue Shopping
                <ArrowForward className="group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Decorative Bottom Wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-full h-24 rotate-180"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="fill-white/5"
            ></path>
          </svg>
        </div>
      </div>

      {/* Background Animation Styles */}
      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 0.4; }
          50% { opacity: 0.6; }
          100% { opacity: 0.4; }
        }
        .animate-pulse {
          animation: pulse 3s infinite;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </motion.div>
  );
};

export default Error;
