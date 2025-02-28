import axios from 'axios';
import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSpring, animated } from '@react-spring/web';
import logo from '../assets/logo.png';
import { TextField, InputAdornment, IconButton } from '@mui/material/';
import { Visibility, VisibilityOff, Email, LockOpen, Person, ShoppingCart } from '@mui/icons-material';
import LoginIcon from '@mui/icons-material/Login';
import { toast, Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { requestPermission } from '../Service/Firebase';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import LoadingSpinner from './Loading';
const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpGenerated, setOtpGenerated] = useState(false);
  const [validOtp, setValidOTP] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  // Add this particle initialization function
  const particlesInit = useCallback(async engine => {
    await loadFull(engine);
  }, []);

  const generateOtp = async () => {
    if (!email) {
      toast.error('Please enter your email first');
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.post(`${apiUrl}/otpVerification`, { email });
      setValidOTP(res.data.validOTP);
      setOtpGenerated(true);
      toast.success('OTP sent to your email');
    } catch (err) {
      toast.error('Failed to generate OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/signup`, {
        name,
        username: email,
        password,
        otp,
        validOtp
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.user) {
        toast.success('Account created successfully! 🎉');
        navigate('/');
      } else {
        toast.error('Signup failed - Invalid response');
      }
    } catch (error) {
      toast.error(error.response?.data || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const googleSignup = async () => {
    const token = await requestPermission();
    console.log("token form frontend googel login", token);
  
    window.open(`${apiUrl}/auth/google/callback?fcmToken=${token}`, "_self");
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: {
            enable: false,
            zIndex: 0
          },
          background: {
            color: {
              value: "transparent",
            },
          },
          fpsLimit: 60,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "repulse",
              },
              resize: true,
            },
            modes: {
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 100,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: "#ffffff",
            },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: true,
              opacity: 0.2,
              width: 1,
            },
            collisions: {
              enable: true,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 1,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.3,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 3 },
            },
          },
          detectRetina: true,
        }}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: 0
        }}
      />

      <animated.div style={fadeIn} className="relative z-10 w-full max-w-md p-6">
        <motion.div
          className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] border border-white/20 p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
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
              Create your account
            </p>
          </motion.div>

          <form onSubmit={handleSignup} className="space-y-4">
            <TextField
              fullWidth
              label="Full Name"
              variant="outlined"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person className="text-purple-300" />
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
                  '& input': {
                    '&:-webkit-autofill': {
                      'WebkitBoxShadow': '0 0 0 1000px transparent inset',
                      'WebkitTextFillColor': 'white',
                      'transition': 'background-color 5000s ease-in-out 0s',
                      'backgroundColor': 'transparent !important'
                    },
                    '&:-webkit-autofill:hover': {
                      'WebkitBoxShadow': '0 0 0 1000px transparent inset'
                    },
                    '&:-webkit-autofill:focus': {
                      'WebkitBoxShadow': '0 0 0 1000px transparent inset'
                    },
                    '&:-webkit-autofill:active': {
                      'WebkitBoxShadow': '0 0 0 1000px transparent inset'
                    }
                  }
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)'
                }
              }}
            />

            <div className="relative">
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
                    paddingRight: '110px',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                    '&.Mui-focused fieldset': { 
                      borderColor: '#e879f9',
                      borderWidth: '2px'
                    },
                    '& input': {
                      '&:-webkit-autofill': {
                        'WebkitBoxShadow': '0 0 0 1000px transparent inset',
                        'WebkitTextFillColor': 'white',
                        'transition': 'background-color 5000s ease-in-out 0s',
                        'backgroundColor': 'transparent !important'
                      },
                      '&:-webkit-autofill:hover': {
                        'WebkitBoxShadow': '0 0 0 1000px transparent inset'
                      },
                      '&:-webkit-autofill:focus': {
                        'WebkitBoxShadow': '0 0 0 1000px transparent inset'
                      },
                      '&:-webkit-autofill:active': {
                        'WebkitBoxShadow': '0 0 0 1000px transparent inset'
                      }
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)'
                  }
                }}
              />
              <motion.button
                type="button"
                onClick={generateOtp}
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg
                  bg-purple-500/20 hover:bg-purple-500/30 
                  text-purple-200 text-sm font-medium
                  transition-all duration-300
                  z-10"
              >
                {isLoading ? 'Sending...' : 'Get OTP'}
              </motion.button>
            </div>

            {otpGenerated && (
              <TextField
                fullWidth
                label="OTP"
                variant="outlined"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
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
            )}

            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOpen className="text-purple-300" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      className="text-purple-300"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
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
                  '& input': {
                    '&:-webkit-autofill': {
                      'WebkitBoxShadow': '0 0 0 1000px transparent inset',
                      'WebkitTextFillColor': 'white',
                      'transition': 'background-color 5000s ease-in-out 0s',
                      'backgroundColor': 'transparent !important'
                    },
                    '&:-webkit-autofill:hover': {
                      'WebkitBoxShadow': '0 0 0 1000px transparent inset'
                    },
                    '&:-webkit-autofill:focus': {
                      'WebkitBoxShadow': '0 0 0 1000px transparent inset'
                    },
                    '&:-webkit-autofill:active': {
                      'WebkitBoxShadow': '0 0 0 1000px transparent inset'
                    }
                  }
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)'
                }
              }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              variant="outlined"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOpen className="text-purple-300" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      className="text-purple-300"
                    >
                      {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
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
                  '& input': {
                    '&:-webkit-autofill': {
                      'WebkitBoxShadow': '0 0 0 1000px transparent inset',
                      'WebkitTextFillColor': 'white',
                      'transition': 'background-color 5000s ease-in-out 0s',
                      'backgroundColor': 'transparent !important'
                    },
                    '&:-webkit-autofill:hover': {
                      'WebkitBoxShadow': '0 0 0 1000px transparent inset'
                    },
                    '&:-webkit-autofill:focus': {
                      'WebkitBoxShadow': '0 0 0 1000px transparent inset'
                    },
                    '&:-webkit-autofill:active': {
                      'WebkitBoxShadow': '0 0 0 1000px transparent inset'
                    }
                  }
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)'
                }
              }}
            />

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                w-full py-4 px-6 rounded-xl font-medium text-white
                bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500
                hover:from-purple-600 hover:via-fuchsia-600 hover:to-pink-600
                transition-all duration-300 shadow-lg hover:shadow-xl
                flex items-center justify-center gap-2
                ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}
              `}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner />
                  <span>Creating Account...</span>
                </div>
              ) : (
                <>
                  <span>Create Account</span>
                  <LoginIcon />
                </>
              )}
            </motion.button>
          </form>

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
            onClick={googleSignup}
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
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-purple-400 hover:text-purple-300 transition-colors duration-300"
            >
              Sign In
            </Link>
          </motion.p>
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

export default Signup;
