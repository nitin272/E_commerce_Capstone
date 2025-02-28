import React, { useEffect, useState, forwardRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpring, animated } from '@react-spring/web';

import logo from "../assets/logo.png";
import axios from 'axios';
import {
  Button, IconButton, Drawer, List, ListItem, Typography, Avatar, Dialog, DialogActions, DialogContent, DialogTitle,
  useMediaQuery, BottomNavigation, BottomNavigationAction, Menu, MenuItem, Box,
} from '@mui/material';
import {
  Category, Chat, AccountCircle, Logout, Login, ContactMail, Home, Dashboard, ArrowDropDown, Menu as MenuIcon, ContactSupport,
} from '@mui/icons-material';
import toast, { Toaster } from 'react-hot-toast';

const Navbar = forwardRef(() => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [value, setValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:960px)');
  const apiUrl = "https://e-commerce-capstone.onrender.com";

  const toggleDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${apiUrl}/login/success`, { withCredentials: true});
      setUserData(response.data.user);
      setIsAdmin(response.data.user.role === 'admin');
    } catch (error) {
      console.error('Error fetching user data!');
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await axios.get(`${apiUrl}/logout`, { withCredentials: true });
      toast.success('Logout successful!');
     
      setUserData({});
      setIsAdmin(false);
      navigate('/');
      localStorage.clear();
    } catch (error) {
      console.error('Error logging out!');
    }
  
  };

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleChatClick = () => {
    if (!userData || Object.keys(userData).length === 0) {
      setDialogOpen(true);
    } else {
      navigate('/chat'); 
    }
  };


  const handleDialogClose = (action) => {
    setDialogOpen(false);
    if (action === 'login') navigate('/login'); 
  };
  
  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(-20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 280, friction: 20 }
  });

 

 

  return (
    <div className="relative">
      <Toaster 
  position="top-center" 
  reverseOrder={false} 
/>
     

      <animated.div style={fadeIn} className='fixed top-0 left-0 right-0 z-50'>
        <div className='flex justify-between items-center p-4 bg-gradient-to-r from-slate-900/90 via-purple-900/90 to-slate-900/90 backdrop-blur-md border-b border-white/10 shadow-2xl'>
          <div className='flex items-center cursor-pointer' onClick={() => handleNavigate('/')}>
            <img 
              src={logo} 
              alt="logo" 
              className={`h-12 object-cover mr-3 ${isTablet ? 'h-10' : 'h-14'} hover:scale-105 transition-transform duration-300`} 
            />
            <Typography
              variant="h5"
              component="h4"
              className={`text-xl ${isTablet ? 'text-lg' : 'text-2xl'} font-bold`}
              sx={{ 
                fontFamily: 'serif', 
                background: 'linear-gradient(to right, #fff, #e879f9)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 20px rgba(232, 121, 249, 0.3)',
              }}
            >
              Scale Mart
            </Typography>
          </div>

          {!isMobile && (
            <div className='flex items-center gap-x-4'>
              {Object.keys(userData).length > 0 ? (
                <>
                  <Button
                    variant='contained'
                    onClick={() => handleNavigate('/')}
                    sx={{
                      textTransform: 'none',
                      background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(168, 85, 247, 0.1))',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '0.8rem',
                      border: '1px solid rgba(168, 85, 247, 0.2)',
                      color: 'white',
                      fontWeight: '500',
                      padding: '8px 16px',
                      letterSpacing: '0.5px',
                      '&:hover': {
                        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.5), rgba(168, 85, 247, 0.2))',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Home sx={{ mr: 1 }} /> Home
                  </Button>
                  <Button
                    variant='contained'
                    onClick={() => handleNavigate('/product')}
                    sx={{
                      textTransform: 'none',
                      background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(168, 85, 247, 0.1))',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '0.8rem',
                      border: '1px solid rgba(168, 85, 247, 0.2)',
                      color: 'white',
                      fontWeight: '500',
                      padding: '8px 16px',
                      letterSpacing: '0.5px',
                      '&:hover': {
                        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.5), rgba(168, 85, 247, 0.2))',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Category sx={{ mr: 1 }} /> Products
                  </Button>
                  <Button
                    variant='contained'
                    onClick={() => handleNavigate('/contact')}
                    sx={{
                      textTransform: 'none',
                      background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(168, 85, 247, 0.1))',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '0.8rem',
                      border: '1px solid rgba(168, 85, 247, 0.2)',
                      color: 'white',
                      fontWeight: '500',
                      padding: '8px 16px',
                      letterSpacing: '0.5px',
                      '&:hover': {
                        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.5), rgba(168, 85, 247, 0.2))',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <ContactSupport sx={{ mr: 1 }} /> Contact Us
                  </Button>
                  <Button
                    variant='contained'
                    onClick={() => handleNavigate('/profile')}
                    sx={{
                      textTransform: 'none',
                      background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(168, 85, 247, 0.1))',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '0.8rem',
                      border: '1px solid rgba(168, 85, 247, 0.2)',
                      color: 'white',
                      fontWeight: '500',
                      padding: '8px 16px',
                      letterSpacing: '0.5px',
                      '&:hover': {
                        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.5), rgba(168, 85, 247, 0.2))',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <AccountCircle sx={{ mr: 1 }} /> Profile
                  </Button>
                  {isAdmin && (
                    <Button
                      variant='contained'
                      onClick={() => handleNavigate('/dashboard')}
                      sx={{
                        textTransform: 'none',
                        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(168, 85, 247, 0.1))',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '0.8rem',
                        border: '1px solid rgba(168, 85, 247, 0.2)',
                        color: 'white',
                        fontWeight: '500',
                        padding: '8px 16px',
                        letterSpacing: '0.5px',
                        '&:hover': {
                          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.5), rgba(168, 85, 247, 0.2))',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <Dashboard sx={{ mr: 1 }} /> Dashboard
                    </Button>
                  )}
                  <Button
                    variant='contained'
                    onClick={handleChatClick}
                    sx={{
                      textTransform: 'none',
                      background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(168, 85, 247, 0.1))',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '0.8rem',
                      border: '1px solid rgba(168, 85, 247, 0.2)',
                      color: 'white',
                      fontWeight: '500',
                      padding: '8px 16px',
                      letterSpacing: '0.5px',
                      '&:hover': {
                        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.5), rgba(168, 85, 247, 0.2))',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Chat sx={{ mr: 1 }} /> Chat
                  </Button>
                  <Button
                    variant='contained'
                    onClick={logout}
                    sx={{
                      textTransform: 'none',
                      background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(168, 85, 247, 0.1))',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '0.8rem',
                      border: '1px solid rgba(168, 85, 247, 0.2)',
                      color: 'white',
                      fontWeight: '500',
                      padding: '8px 16px',
                      letterSpacing: '0.5px',
                      '&:hover': {
                        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.5), rgba(168, 85, 247, 0.2))',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Logout sx={{ mr: 1 }} /> Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant='contained'
                    onClick={() => handleNavigate('/login')}
                    sx={{
                      textTransform: 'none',
                      background: 'linear-gradient(to right, #9333ea, #e879f9)',
                      borderRadius: '0.8rem',
                      color: 'white',
                      fontWeight: '500',
                      padding: '8px 20px',
                      letterSpacing: '0.5px',
                      boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(to right, #7e22ce, #d946ef)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 15px rgba(168, 85, 247, 0.4)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Login sx={{ mr: 1 }} /> Login
                  </Button>
                  <Button
                    variant='outlined'
                    onClick={() => handleNavigate('/signup')}
                    sx={{
                      textTransform: 'none',
                      background: 'transparent',
                      borderRadius: '0.8rem',
                      border: '2px solid rgba(168, 85, 247, 0.5)',
                      color: 'white',
                      fontWeight: '500',
                      padding: '7px 19px',
                      letterSpacing: '0.5px',
                      '&:hover': {
                        background: 'rgba(168, 85, 247, 0.1)',
                        borderColor: '#a855f7',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Login sx={{ mr: 1 }} /> Sign-Up
                  </Button>
                </>
              )}
            </div>
          )}

          {isMobile && (
            <IconButton 
              onClick={toggleDrawer(true)}
              sx={{ 
                color: 'white',
                background: 'rgba(168, 85, 247, 0.2)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  background: 'rgba(168, 85, 247, 0.3)',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </div>
      </animated.div>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: '280px',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(88, 28, 135, 0.95))',
            backdropFilter: 'blur(10px)',
            border: 'none',
          }
        }}
      >
        <Box sx={{ width: '100%', color: 'white' }}>
          {Object.keys(userData).length > 0 && (
            <Box sx={{ 
              p: 3, 
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'linear-gradient(to right, rgba(147, 51, 234, 0.2), rgba(232, 121, 249, 0.2))',
            }}>
              <div className="flex items-center space-x-3">
                <Avatar 
                  src={userData.ownerImg?.[0]} 
                  alt="User Avatar"
                  sx={{ 
                    width: 50, 
                    height: 50,
                    border: '2px solid rgba(168, 85, 247, 0.5)',
                    boxShadow: '0 0 15px rgba(168, 85, 247, 0.3)',
                  }}
                />
                <div>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 'bold',
                      color: 'white',
                      textShadow: '0 0 10px rgba(168, 85, 247, 0.5)',
                    }}
                  >
                    {userData.name || 'User'}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.875rem',
                    }}
                  >
                    {userData.email}
                  </Typography>
                </div>
              </div>
            </Box>
          )}

          <List sx={{ pt: 2 }}>
            <ListItem 
              button 
              onClick={() => handleNavigate('/')}
              sx={{ 
                py: 2,
                px: 3,
                mb: 1,
                '&:hover': {
                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(168, 85, 247, 0.1))',
                },
                borderRadius: '0.5rem',
                mx: 1,
                transition: 'all 0.3s ease',
              }}
            >
              <Home sx={{ mr: 2, color: '#e879f9' }} />
              <Typography sx={{ 
                color: 'white',
                fontWeight: '500',
                letterSpacing: '0.5px',
              }}>
                Home
              </Typography>
            </ListItem>

            <ListItem 
              button 
              onClick={() => handleNavigate('/product')}
              sx={{ 
                py: 2,
                px: 3,
                mb: 1,
                '&:hover': {
                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(168, 85, 247, 0.1))',
                },
                borderRadius: '0.5rem',
                mx: 1,
                transition: 'all 0.3s ease',
              }}
            >
              <Category sx={{ mr: 2, color: '#e879f9' }} />
              <Typography sx={{ 
                color: 'white',
                fontWeight: '500',
                letterSpacing: '0.5px',
              }}>
                Products
              </Typography>
            </ListItem>

            <ListItem 
              button 
              onClick={() => handleNavigate('/contact')}
              sx={{ 
                py: 2,
                px: 3,
                mb: 1,
                '&:hover': {
                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(168, 85, 247, 0.1))',
                },
                borderRadius: '0.5rem',
                mx: 1,
                transition: 'all 0.3s ease',
              }}
            >
              <ContactSupport sx={{ mr: 2, color: '#e879f9' }} />
              <Typography sx={{ 
                color: 'white',
                fontWeight: '500',
                letterSpacing: '0.5px',
              }}>
                Contact Us
              </Typography>
            </ListItem>

            {Object.keys(userData).length > 0 ? (
              <>
                <ListItem 
                  button 
                  onClick={() => handleNavigate('/profile')}
                  sx={{ 
                    py: 2,
                    px: 3,
                    mb: 1,
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(168, 85, 247, 0.1))',
                    },
                    borderRadius: '0.5rem',
                    mx: 1,
                    transition: 'all 0.3s ease',
                  }}
                >
                  <AccountCircle sx={{ mr: 2, color: '#e879f9' }} />
                  <Typography sx={{ 
                    color: 'white',
                    fontWeight: '500',
                    letterSpacing: '0.5px',
                  }}>
                    Profile
                  </Typography>
                </ListItem>

                <ListItem 
                  button 
                  onClick={handleChatClick}
                  sx={{ 
                    py: 2,
                    px: 3,
                    mb: 1,
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(168, 85, 247, 0.1))',
                    },
                    borderRadius: '0.5rem',
                    mx: 1,
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Chat sx={{ mr: 2, color: '#e879f9' }} />
                  <Typography sx={{ 
                    color: 'white',
                    fontWeight: '500',
                    letterSpacing: '0.5px',
                  }}>
                    Chat
                  </Typography>
                </ListItem>

                {isAdmin && (
                  <ListItem 
                    button 
                    onClick={() => handleNavigate('/dashboard')}
                    sx={{ 
                      py: 2,
                      px: 3,
                      mb: 1,
                      '&:hover': {
                        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(168, 85, 247, 0.1))',
                      },
                      borderRadius: '0.5rem',
                      mx: 1,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Dashboard sx={{ mr: 2, color: '#e879f9' }} />
                    <Typography sx={{ 
                      color: 'white',
                      fontWeight: '500',
                      letterSpacing: '0.5px',
                    }}>
                      Dashboard
                    </Typography>
                  </ListItem>
                )}

                <ListItem 
                  button 
                  onClick={logout}
                  sx={{ 
                    py: 2,
                    px: 3,
                    mb: 1,
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(168, 85, 247, 0.1))',
                    },
                    borderRadius: '0.5rem',
                    mx: 1,
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Logout sx={{ mr: 2, color: '#e879f9' }} />
                  <Typography sx={{ 
                    color: 'white',
                    fontWeight: '500',
                    letterSpacing: '0.5px',
                  }}>
                    Logout
                  </Typography>
                </ListItem>
              </>
            ) : (
              <>
                <ListItem 
                  button 
                  onClick={() => handleNavigate('/login')}
                  sx={{ 
                    py: 2,
                    px: 3,
                    mb: 1,
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(168, 85, 247, 0.1))',
                    },
                    borderRadius: '0.5rem',
                    mx: 1,
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Login sx={{ mr: 2, color: '#e879f9' }} />
                  <Typography sx={{ 
                    color: 'white',
                    fontWeight: '500',
                    letterSpacing: '0.5px',
                  }}>
                    Login
                  </Typography>
                </ListItem>

                <ListItem 
                  button 
                  onClick={() => handleNavigate('/signup')}
                  sx={{ 
                    py: 2,
                    px: 3,
                    mb: 1,
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(168, 85, 247, 0.1))',
                    },
                    borderRadius: '0.5rem',
                    mx: 1,
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Login sx={{ mr: 2, color: '#e879f9' }} />
                  <Typography sx={{ 
                    color: 'white',
                    fontWeight: '500',
                    letterSpacing: '0.5px',
                  }}>
                    Sign-Up
                  </Typography>
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>

      <Dialog
        open={dialogOpen}
        onClose={() => handleDialogClose('cancel')}
        sx={{
          '& .MuiPaper-root': {
            padding: 4,
            borderRadius: 3,
            backgroundColor: '#ffffff',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
            maxWidth: '400px',
            margin: 'auto',
          },
        }}
      >
        <DialogTitle>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              textAlign: 'center',
              color: '#4a90e2',
              mb: 1,
            }}
          >
            Welcome to Chat
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box
            textAlign="center"
            sx={{
              padding: 2,
              borderRadius: 2,
              backgroundColor: '#f7f9fc',
              mb: 2,
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: '#333',
                fontSize: '1rem',
                lineHeight: 1.5,
              }}
            >
              To continue chatting, please log in to your account.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2 }}>
          <Button
            onClick={() => handleDialogClose('cancel')}
            variant="outlined"
            color="secondary"
            sx={{
              borderColor: '#d9534f',
              color: '#d9534f',
              fontWeight: 'bold',
              px: 3,
              py: 1,
              '&:hover': {
                backgroundColor: '#fef2f2',
                borderColor: '#d9534f',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleDialogClose('login')}
            variant="contained"
            sx={{
              backgroundColor: '#4a90e2',
              fontWeight: 'bold',
              px: 3,
              py: 1,
              '&:hover': {
                backgroundColor: '#3a78c3',
              },
            }}
          >
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});

export default Navbar;
