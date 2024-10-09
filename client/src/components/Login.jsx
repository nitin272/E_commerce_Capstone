import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo.png'; 
import { Button, TextField, InputAdornment } from '@mui/material/';
import { Google, Email, LockOpen } from '@mui/icons-material';
import LoginIcon from '@mui/icons-material/Login';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_APP_API_URL;

  // Handle login button click
  const onLoginBtn = async (e) => {
    e.preventDefault();
    try {
      // Send login request to backend with credentials
      const response = await axios.post(`${apiUrl}/login`, {
        username: email,
        password
      }, { withCredentials: true }); // Added withCredentials

      toast.success('Login successful');
      navigate('/'); // Redirect to home page
    } catch (error) {
      toast.error(error.response?.data || 'Login failed');
    }
  };

  // Check for valid token on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Check token validity
          const response = await axios.get(`${apiUrl}/login/success`, {
            headers: { 'Authorization': `Bearer ${token}` },
            withCredentials: true // Ensure credentials are included
          });
          if (response.data.user) {
            navigate('/'); // Redirect if authenticated
          }
        } catch (error) {
          console.log('Error validating token', error);
        }
      }
    };
    checkAuth();
  }, [navigate, apiUrl]);

  // Google OAuth login
  const googlePage = () => {
    window.open(`${apiUrl}/auth/google/callback`, "_self");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
      <div className="flex flex-col items-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-8 bg-white rounded-lg shadow-lg">
        <img src={logo} alt="Logo" className="mx-auto h-24 mb-4" />
        <h1 className="text-2xl font-bold mb-4">Scale Mart</h1>

        <h2 className="text-3xl font-light mb-4 text-center">Login</h2>

        <form onSubmit={onLoginBtn} className="flex flex-col space-y-4 w-full max-w-md">
          <TextField
            type="email"
            required
            placeholder="Enter your email"
            label="Email Address"
            variant="outlined"
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Email />
                </InputAdornment>
              )
            }}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            type="password"
            required
            variant="outlined"
            size="small"
            label="Password"
            placeholder="Enter your password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <LockOpen />
                </InputAdornment>
              )
            }}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="text-blue-500 cursor-pointer text-sm text-right mb-2" onClick={() => navigate('/forgetPassword')}>
            Forgot password?
          </p>

          <Button
            endIcon={<LoginIcon />}
            variant="contained"
            size="large"
            type="submit"
            className="w-full"
          >
            Login
          </Button>
        </form>

        <div className="flex items-center justify-center mt-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-4 text-gray-500">Or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<Google />}
          onClick={googlePage}
          className="w-full mt-4"
        >
          Continue with Google
        </Button>

        <p className="text-sm mt-4 text-center">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-500">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
