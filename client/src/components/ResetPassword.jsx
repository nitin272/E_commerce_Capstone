import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, TextField, InputAdornment, IconButton, Box, Paper, CircularProgress } from '@mui/material/';
import { Visibility, VisibilityOff, LockReset, ArrowBack } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPassword = () => {
  const { id, token } = useParams();
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const apiUrl = "https://e-commerce-capstone.onrender.com";

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const validatePassword = (password) => {
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      setPasswordError('Password must contain at least one uppercase letter');
      return false;
    }
    if (!/[a-z]/.test(password)) {
      setPasswordError('Password must contain at least one lowercase letter');
      return false;
    }
    if (!/[0-9]/.test(password)) {
      setPasswordError('Password must contain at least one number');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = () => {
    if (password !== rePassword) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const OnSubmitBtn = async (e) => {
    e.preventDefault();
    
    if (!validatePassword(password) || !validateConfirmPassword()) {
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${apiUrl}/resetPassword/${id}/${token}`, { password });
      toast.success('🎉 Password reset successful!', {
        position: "top-center",
        autoClose: 3000,
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
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      toast.error('❌ Password reset failed. Please try again.', {
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
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
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
          
          <div className='text-center'>
            <LockReset 
              sx={{ 
                fontSize: 64, 
                color: '#6B46C1',
                marginBottom: 2,
                animation: 'bounce 2s infinite'
              }} 
            />
            <h1 className='text-4xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4'>
              Reset Password
            </h1>
            <p className='text-gray-600 text-lg mb-6'>
              Create a strong password for your account
            </p>
          </div>
        </div>

        <form onSubmit={OnSubmitBtn} className='space-y-6'>
          <TextField
            type={showPassword ? 'text' : 'password'}
            name="NewPassword"
            required
            label="New Password"
            variant="outlined"
            error={!!passwordError}
            helperText={passwordError}
            fullWidth
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
                  <IconButton
                    onClick={togglePasswordVisibility}
                    edge="end"
                    sx={{ color: passwordError ? '#f44336' : '#6B46C1' }}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onChange={(e) => {
              setPassword(e.target.value);
              validatePassword(e.target.value);
            }}
          />

          <TextField
            type={showConfirmPassword ? 'text' : 'password'}
            name="ConfirmPassword"
            required
            label="Confirm Password"
            variant="outlined"
            error={!!confirmPasswordError}
            helperText={confirmPasswordError}
            fullWidth
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
                  <IconButton
                    onClick={toggleConfirmPasswordVisibility}
                    edge="end"
                    sx={{ color: confirmPasswordError ? '#f44336' : '#6B46C1' }}
                  >
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onChange={(e) => {
              setRePassword(e.target.value);
              if (e.target.value) validateConfirmPassword();
            }}
          />

          <Button
            type='submit'
            variant='contained'
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
              'Reset Password'
            )}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default ResetPassword;
