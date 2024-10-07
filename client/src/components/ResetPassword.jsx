import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, TextField, InputAdornment, IconButton } from '@mui/material/';
import { Visibility, VisibilityOff, LockReset, PublishedWithChanges } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPassword = () => {
  const { id, token } = useParams();
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const apiUrl = import.meta.env.VITE_APP_API_URL;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const OnSubmitBtn = (e) => {
    e.preventDefault();
    if (password !== rePassword) {
      toast.error("Passwords do not match");
      return;
    }

    axios.post(`${apiUrl}/resetPassword/${id}/${token}`, { password })
      .then((res) => {
        toast.success('Password reset successfully. Redirecting to login.');
        setTimeout(() => navigate('/login'), 2000); // Redirect after a short delay
      })
      .catch(err => {
        toast.error('Failed to reset password. Please try again.');
      });
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar newestOnTop closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover />

      <div className='w-80 flex flex-col items-center justify-center text-center mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg'>
        <LockReset color='primary' sx={{ fontSize: 80 }} className="mb-8" />
        <h1 className='text-3xl font-light mb-8'>Reset Password</h1>
        <form onSubmit={(e) => OnSubmitBtn(e)}>
          <div className='mb-4'>
            <TextField
              type={showPassword ? 'text' : 'password'}
              name="NewPassword"
              required
              label="New Password"
              variant="outlined"
              size="medium"
              color="primary"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <Visibility color='primary' /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              placeholder='Enter a new password'
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className='mb-4'>
            <TextField
              type={showConfirmPassword ? 'text' : 'password'}
              name="ConfirmPassword"
              required
              label="Confirm Password"
              variant="outlined"
              size="medium"
              color="primary"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={toggleConfirmPasswordVisibility} edge="end">
                      {showConfirmPassword ? <Visibility color='primary' /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              placeholder='Confirm your new password'
              onChange={(e) => setRePassword(e.target.value)}
            />
          </div>
          <Button
            type='submit'
            variant='contained'
            color='primary'
            size='large'
            fullWidth
            endIcon={<PublishedWithChanges />}
          >
            Change
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
