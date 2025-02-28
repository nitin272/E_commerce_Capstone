import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSpring, animated } from '@react-spring/web';
import logo from '../assets/logo.png';
import { TextField, InputAdornment } from '@mui/material/';
import { Email, LockOpen, ShoppingCart } from '@mui/icons-material';
import LoginIcon from '@mui/icons-material/Login';
import { toast, Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const apiUrl = "https://e-commerce-capstone.onrender.com";

  // React Spring animations
  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 280, friction: 20 }
  });

  const scaleIn = useSpring({
    from: { scale: 0 },
    to: { scale: 1 },
    config: { tension: 200, friction: 12 }
  });

 

  const onLoginBtn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/login`, {
        username: email,
        password,
      }, { withCredentials: true });
      toast.success('Welcome to Scale Mart! 🎉');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
  
        try {
        const response = await axios.get(`${apiUrl}/login/success`, {
            withCredentials: true,
          });
          if (response.data.user) {
            navigate('/');
          }
        } catch (error) {
          console.log('Error validating token', error);
      
      }
    };
    checkAuth();
  }, [navigate, apiUrl]);

  const googlePage = async () => {
    try {
        const url = `${apiUrl}/auth/google`;
        window.open(url, "_self"); 
    } catch (error) {
      console.error('Error opening Google auth page:', error);
      toast.error('Google authentication failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Particles */}
     
      {/* Gradient Blobs */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-10 left-10 w-60 h-60 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-10 w-60 h-60 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <animated.div style={fadeIn} className="relative z-10 w-full max-w-md p-6">
        <motion.div
          className="relative bg-white/10 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] border border-white/20 p-8 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Login Block Particles */}
       

          <div className="relative z-10">
            <animated.div style={scaleIn} className="flex flex-col items-center">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img src={logo} alt="Scale Mart" className="h-28 w-auto mb-2 drop-shadow-2xl" />
                <ShoppingCart className="absolute -right-2 -bottom-2 text-pink-400 text-3xl transform rotate-12" />
              </motion.div>
              
              <h1 className="text-4xl font-bold mt-4 mb-2 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Scale Mart
              </h1>
              <p className="text-gray-300 mb-8 text-center">
                Your One-Stop Shopping Destination
              </p>
            </animated.div>

            <form onSubmit={onLoginBtn} className="space-y-6">
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
               <TextField
  fullWidth
  label="Email Address"
  variant="outlined"
  type="email"
  required
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <Email className="text-purple-300" />
      </InputAdornment>
    ),
  }}
  sx={{
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '1rem',
      color: 'white',
      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
      '&.Mui-focused fieldset': { 
        borderColor: '#e879f9',
        borderWidth: '2px'
      },
    },
    '& .MuiInputLabel-root': {
      color: 'rgba(255, 255, 255, 0.7)',
    },
    '& input:-webkit-autofill': {
      '-webkit-box-shadow': '0 0 0 100px rgba(255, 255, 255, 0.05) inset !important',
      '-webkit-text-fill-color': 'white !important',
      'caret-color': 'white',
    },
  }}
/>


                <TextField
                  fullWidth
                  label="Password"
                  variant="outlined"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOpen className="text-purple-300" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '1rem',
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                      '&.Mui-focused fieldset': { 
                        borderColor: '#e879f9',
                        borderWidth: '2px'
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                  }}
                />
              </motion.div>

              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-purple-300 hover:text-purple-200 transition-colors duration-300"
                >
                  Forgot password?
                </Link>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  w-full py-4 px-6 rounded-xl font-medium text-white
                  bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500
                  hover:from-purple-600 hover:via-fuchsia-600 hover:to-pink-600
                  transition-all duration-300 shadow-lg hover:shadow-xl
                  flex items-center justify-center gap-2 relative overflow-hidden
                  ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}
                `}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <>
                    <span>Sign in to Shop</span>
                    <LoginIcon />
                  </>
                )}
              </motion.button>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-gray-400">Or continue with</span>
                </div>
              </div>

              <motion.button
                type="button"
                onClick={googlePage}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                whileTap={{ scale: 0.98 }}
                className="
                  w-full py-4 px-6 rounded-xl font-medium
                  bg-white/5 backdrop-blur-md
                  border border-white/20 hover:border-white/40
                  text-white transition-all duration-300
                  flex items-center justify-center gap-3
                  shadow-lg hover:shadow-xl
                "
              >
                <FcGoogle className="w-6 h-6" />
                <span>Continue with Google</span>
              </motion.button>

              <motion.p 
                className="mt-8 text-center text-sm text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                New to Scale Mart?{' '}
                <Link
                  to="/signup"
                  className="font-medium text-purple-400 hover:text-purple-300 transition-colors duration-300"
                >
                  Create an Account
                </Link>
              </motion.p>
            </form>
          </div>
        </motion.div>
      </animated.div>
      
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e1e1e',
            color: '#fff',
            borderRadius: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#a855f7',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
};

export default Login;
