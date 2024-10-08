import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, InputAdornment } from '@mui/material/';
import { Email } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const apiUrl = "https://e-commerce-capstone.onrender.com";

  const onSendbtn = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiUrl}/forgotPassword`, { username: email });
      toast.success('Please check your email for further instructions.');
      setTimeout(() => {
        navigate('/login');
      }, 3000); // Redirect after 3 seconds
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4'>
      <ToastContainer />
      <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-lg'>
        <h1 className='text-3xl font-bold mb-6 text-center'>Forget Password</h1>
        <form onSubmit={onSendbtn} className='flex flex-col space-y-4'>
          <TextField
            type="email"
            required
            placeholder='Enter your email'
            label="Email Address"
            variant="outlined"
            size='medium'
            color='primary'
            className='h-14'
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Email color='primary' />
                </InputAdornment>
              ),
            }}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            color='primary'
            variant='contained'
            size='large'
            type='submit'
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
