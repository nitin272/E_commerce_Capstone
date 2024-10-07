import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo.png'; // Ensure this is the correct path for your logo

import { Button, TextField, InputAdornment, IconButton } from '@mui/material/';
import { Visibility, VisibilityOff, Google, PermIdentity, Lock } from '@mui/icons-material';
import { Login } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpGenerated, setOtpGenerated] = useState(false);
  const [validOtp, setValidOTP] = useState('');
  const [error, setError] = useState('');
  const [warn, setWarn] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_APP_API_URL;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onSignupBtn = (e) => {
    e.preventDefault();
    if (otpGenerated) {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
      if (password === confirmPassword) {
        if (passwordRegex.test(password)) {
          axios.post(`${apiUrl}/signup`, {
            name,
            username: email,
            password,
            otp,
            validOtp
          }).then(res => {
            localStorage.setItem("id", res.data._id);
            navigate('/');
          }).catch(error => {
            toast.error(error.response.data);
          });
        } else {
          toast.error('Password must be at least 8 characters long and contain at least one letter, one number, and one special character.');
        }
      } else {
        toast.error('Passwords do not match.');
      }
    } else {
      toast.error('Please generate OTP.');
    }
  };

  const generateOtp = () => {
    setValidOTP('');
    if (email) {
      axios.post(`${apiUrl}/otpVerification`, { email })
        .then(res => {
          setValidOTP(res.data.validOTP);
          setOtpGenerated(true);
          toast.info('OTP sent to your email');
        }).catch(err => {
          toast.error('Failed to generate OTP. Please try again.');
          console.log(err);
        });
    }
  };

  const googleSignup = () => {
    window.open(`${apiUrl}/auth/google/callback`, "_self");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar newestOnTop closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover />
      <div className="flex flex-col items-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-8 bg-white rounded-lg shadow-lg">
        <img src={logo} alt="Logo" className="mx-auto h-24 mb-4" />
        <h1 className="text-2xl font-bold mb-4">Balaji Electronics</h1>

        {error &&
          <toast.error>{error}</toast.error>
        }

        {warn &&
          <toast.info>{warn}</toast.info>
        }

        <h2 className="text-3xl font-light mb-4 text-center">Sign Up</h2>

        <form onSubmit={onSignupBtn} className="flex flex-col space-y-4 w-full max-w-md">
          <TextField
            type="text"
            name="name"
            required
            placeholder="Enter your name"
            label="Name"
            variant="outlined"
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <PermIdentity />
                </InputAdornment>
              )
            }}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            type="email"
            name="email"
            required
            placeholder="Enter your email"
            label="Email"
            variant="outlined"
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => generateOtp()}
                  >
                    Generate OTP
                  </Button>
                </InputAdornment>
              )
            }}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            type={showPassword ? 'text' : 'password'}
            name="password"
            required
            placeholder="Enter your password"
            label="Password"
            variant="outlined"
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            onChange={(e) => setPassword(e.target.value)}
          />

          <TextField
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            required
            placeholder="Confirm your password"
            label="Confirm Password"
            variant="outlined"
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleConfirmPasswordVisibility} edge="end">
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {otpGenerated &&
            <TextField
              type="text"
              name="otp"
              required
              placeholder="Enter OTP"
              label="OTP"
              variant="outlined"
              size="small"
              className='h-12'
              onChange={(e) => setOtp(e.target.value)}
            />
          }

          <Button
            type="submit"
            variant="contained"
            size="large"
            endIcon={<Login />}
            className="w-full"
          >
            Sign Up
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
          onClick={googleSignup}
          className="w-full mt-4"
        >
          Continue with Google
        </Button>

        <p className="text-sm mt-4 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500">
            Login
          </Link>
        </p>
      </div>
      
    </div>
  );
};

export default Signup;
