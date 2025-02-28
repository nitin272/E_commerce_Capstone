import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, InputAdornment, CircularProgress, Box, Paper } from '@mui/material/';
import { Email, ArrowBack } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();
  const apiUrl = "https://e-commerce-capstone.onrender.com";

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!regex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const onSendbtn = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) return;
    
    setLoading(true);
    try {
      await axios.post(`${apiUrl}/forgotPassword`, { username: email });
      toast.success('🎉 Reset link sent! Check your email inbox', {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: '#4CAF50',
          color: 'white',
          borderRadius: '10px',
          fontSize: '16px'
        }
      });
      setTimeout(() => {
        navigate('/login');
      }, 4000);
    } catch (error) {
      toast.error('❌ Oops! Something went wrong. Please try again.', {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: '#f44336',
          color: 'white',
          borderRadius: '10px',
          fontSize: '16px'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      className='min-h-screen flex items-center justify-center p-4'
      sx={{
        background: 'linear-gradient(135deg, #6B46C1 0%, #2563EB 100%)',
        animation: 'gradientAnimation 10s ease infinite',
        '@keyframes gradientAnimation': {
          '0%': {
            backgroundPosition: '0% 50%'
          },
          '50%': {
            backgroundPosition: '100% 50%'
          },
          '100%': {
            backgroundPosition: '0% 50%'
          }
        }
      }}
    >
      <ToastContainer />
      <Paper 
        elevation={24}
        className='w-full max-w-md p-8 transform transition-all duration-300 hover:scale-[1.02]'
        sx={{
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        }}
      >
        <div className='mb-8'>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/login')}
            className='mb-4 hover:bg-gray-100 transition-colors duration-300'
            sx={{
              color: '#6B46C1',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: 'rgba(107, 70, 193, 0.1)'
              }
            }}
          >
            Back to Login
          </Button>
          <h1 className='text-4xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent'>
            Forgot Password?
          </h1>
          <p className='text-center text-gray-600 mt-4 text-lg'>
            Don't worry! Enter your email and we'll send you a reset link.
          </p>
        </div>
        
        <form onSubmit={onSendbtn} className='flex flex-col space-y-6'>
          <TextField
            type="email"
            required
            placeholder='Enter your email address'
            label="Email Address"
            variant="outlined"
            size='large'
            error={!!emailError}
            helperText={emailError}
            color='primary'
            fullWidth
            value={email}
            sx={{
              '& .MuiOutlinedInput-root': {
                height: '56px',
                borderRadius: '12px',
                '&:hover fieldset': {
                  borderColor: '#6B46C1',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#6B46C1',
                }
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Email sx={{ color: emailError ? '#f44336' : '#6B46C1' }} />
                </InputAdornment>
              ),
            }}
            onChange={(e) => {
              setEmail(e.target.value);
              validateEmail(e.target.value);
            }}
          />
          <Button
            variant='contained'
            size='large'
            type='submit'
            disabled={loading}
            fullWidth
            sx={{
              height: '56px',
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: '12px',
              background: 'linear-gradient(45deg, #6B46C1 30%, #2563EB 90%)',
              boxShadow: '0 3px 15px 2px rgba(107, 70, 193, 0.3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5B3BA8 30%, #1D4ED8 90%)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 20px 2px rgba(107, 70, 193, 0.4)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? (
              <CircularProgress size={28} sx={{ color: 'white' }} />
            ) : (
              'Send Email'
            )}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default ForgetPassword;
