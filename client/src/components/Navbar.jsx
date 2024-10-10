import React, { useEffect, useState, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/logo.png";
import axios from 'axios';
import {
  Button, IconButton, Drawer, List, ListItem, ListItemText, Divider, Typography, useMediaQuery
} from '@mui/material';
import {
  Category, Chat, AccountCircle, Logout, Login, LockOpen, ContactMail, Home, Dashboard
} from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = forwardRef(() => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
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
      const response = await axios.get(`${apiUrl}/login/success`, { withCredentials: true });
      setUserData(response.data.user);
      setIsAdmin(response.data.user.role === 'admin');
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await axios.get(`${apiUrl}/logout`, { withCredentials: true });
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setUserData({});
      setIsAdmin(false);
      navigate('/');
      localStorage.clear();
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  return (
    <div className='fixed top-0 left-0 right-0 flex justify-between items-center p-3 shadow-md w-full bg-white z-50'>
      {/* Logo and Title */}
      <div className='flex items-center cursor-pointer'>

        <img src={logo} alt="logo" className={`h-12 object-cover mr-2 ${isTablet ? 'h-10' : 'h-16'}`} />
        <Typography variant="h5" component="h4" className={`text-xl ${isTablet ? 'text-lg' : 'text-2xl'} font-bold`} sx={{ fontFamily: 'serif', color: '#001F2B' }}>
        Scale Mart

        </Typography>

      
      </div>

      {/* Right Side (Buttons/Menu) */}
      <div className='flex items-center'>
        {isMobile ? (
          <>
            {/* Mobile Drawer Menu */}
            <IconButton
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ color: 'black' }}
            >
              <MenuIcon sx={{ fontSize: '2.5rem', color: 'black' }} />
            </IconButton>
            <Drawer
              anchor='right'
              open={drawerOpen}
              onClose={toggleDrawer(false)}
              
            >
              <div className='w-60' >
                <List>
                  <ListItem>
                    <Typography
                      variant="body1"
                      sx={{ fontFamily: 'serif', fontWeight: 'bold', color: '#001F2B', fontSize: '1.8rem' }}
                    >
                      <span>{Object.keys(userData).length > 0 ? 'Welcome Back ' : 'Welcome '}</span>
                      <span style={{ color: '#5151f8' }}>{userData.name}</span>
                    </Typography>
                  </ListItem>

                  <Divider />
                  {Object.keys(userData).length > 0 ? (
                    <>
                      <ListItem button onClick={() => handleNavigate('/')} sx={{ textAlign: 'left', py: 2, bgcolor: '#1E1E2F', '&:hover': { bgcolor: '#27293D' } }}>
                        <Home sx={{ mr: 2, color: '#BBDEFB' }} /> <ListItemText primary="Home" primaryTypographyProps={{ color: '#FFFFFF' }} />
                      </ListItem>
                      <ListItem button onClick={() => handleNavigate('/product')} sx={{ textAlign: 'left', py: 2, bgcolor: '#1E1E2F', '&:hover': { bgcolor: '#27293D' } }}>
                        <Category sx={{ mr: 2, color: '#81D4FA' }} /> <ListItemText primary="Products" primaryTypographyProps={{ color: '#FFFFFF' }} />
                      </ListItem>
                      <ListItem button onClick={() => handleNavigate('/profile')} sx={{ textAlign: 'left', py: 2, bgcolor: '#1E1E2F', '&:hover': { bgcolor: '#27293D' } }}>
                        <AccountCircle sx={{ mr: 2, color: '#A5D6A7' }} /> <ListItemText primary="Profile" primaryTypographyProps={{ color: '#FFFFFF' }} />
                      </ListItem>
                      <ListItem button onClick={() => handleNavigate('/chat')} sx={{ textAlign: 'left', py: 2, bgcolor: '#1E1E2F', '&:hover': { bgcolor: '#27293D' } }}>
                        <Chat sx={{ mr: 2, color: '#FFAB40' }} /> <ListItemText primary="Chats" primaryTypographyProps={{ color: '#FFFFFF' }} />
                      </ListItem>
                      <ListItem button onClick={() => handleNavigate('/contact')} sx={{ textAlign: 'left', py: 2, bgcolor: '#1E1E2F', '&:hover': { bgcolor: '#27293D' } }}>
                        <ContactMail sx={{ mr: 2, color: '#FF6F61' }} /> <ListItemText primary="Contact Us" primaryTypographyProps={{ color: '#FFFFFF' }} />
                      </ListItem>
                      {isAdmin && (
                        <ListItem button onClick={() => handleNavigate('/dashboard')} sx={{ textAlign: 'left', py: 2, bgcolor: '#1E1E2F', '&:hover': { bgcolor: '#27293D' } }}>
                          <Dashboard sx={{ mr: 2, color: '#81D4FA' }} /> <ListItemText primary="Dashboard" primaryTypographyProps={{ color: '#FFFFFF' }} />
                        </ListItem>
                      )}
                      <ListItem button onClick={logout} sx={{ textAlign: 'left', py: 2, bgcolor: '#1E1E2F', '&:hover': { bgcolor: '#27293D' } }}>
                        <Logout sx={{ mr: 2, color: '#FF5252' }} /> <ListItemText primary="Logout" primaryTypographyProps={{ color: '#FFFFFF' }} />
                      </ListItem>

                    </>
                  ) : (
                    <>
                      <ListItem button onClick={() => handleNavigate('/login')} sx={{ textAlign: 'left', py: 2 }}>
                        <Login sx={{ mr: 2 }} /> <ListItemText primary="Login" />
                      </ListItem>
                      <ListItem button onClick={() => handleNavigate('/signup')} sx={{ textAlign: 'left', py: 2 }}>
                        <LockOpen sx={{ mr: 2 }} /> <ListItemText primary="Signup" />
                      </ListItem>
                    </>
                  )}
                </List>
              </div>
            </Drawer>
          </>
        ) : (
          <div className='flex items-center gap-x-3'>
            {/* Desktop View Buttons */}
            <Typography variant="body1" className={`text-lg ${isTablet ? 'text-sm' : 'text-lg'} font-bold`} sx={{ fontFamily: 'serif', color: 'black' }}>
              {Object.keys(userData).length > 0 ? `Welcome back ${userData.name}` : 'Welcome Guest'}
            </Typography>
            {Object.keys(userData).length > 0 ? (
              <>
                <Button
                  variant='contained'
                  size='medium'
                  onClick={() => handleNavigate('/product')}
                  sx={{ textTransform: 'none', backgroundColor: '#007BFF', fontSize: isTablet ? '0.8rem' : '1rem' }}
                >
                  <Category sx={{ mr: 1 }} /> Products
                </Button>
                <Button
                  variant='contained'
                  size='medium'
                  onClick={() => handleNavigate('/profile')}
                  sx={{ textTransform: 'none', backgroundColor: '#9c27b0', fontSize: isTablet ? '0.8rem' : '1rem' }}
                >
                  <AccountCircle sx={{ mr: 1 }} /> Profile
                </Button>
                <Button
                  variant='contained'
                  size='medium'
                  onClick={() => handleNavigate('/chat')}
                  sx={{ textTransform: 'none', backgroundColor: '#FF9800', fontSize: isTablet ? '0.8rem' : '1rem' }}
                >
                  <Chat sx={{ mr: 1 }} /> Chats
                </Button>
                <Button
                  variant='contained'
                  size='medium'
                  onClick={() => handleNavigate('/contact')}
                  sx={{ textTransform: 'none', backgroundColor: '#009688', fontSize: isTablet ? '0.8rem' : '1rem' }}
                >
                  <ContactMail sx={{ mr: 1 }} /> Contact Us
                </Button>
                {isAdmin && (
                  <Button
                    variant='contained'
                    size='medium'
                    onClick={() => handleNavigate('/dashboard')}
                    sx={{ textTransform: 'none', backgroundColor: '#388E3C', fontSize: isTablet ? '0.8rem' : '1rem' }}
                  >
                    <Dashboard sx={{ mr: 1 }} /> Dashboard
                  </Button>
                )}
                <Button
                  variant='contained'
                  size='medium'
                  onClick={logout}
                  sx={{ textTransform: 'none', backgroundColor: '#F44336', fontSize: isTablet ? '0.8rem' : '1rem' }}
                >
                  <Logout sx={{ mr: 1 }} /> Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant='contained'
                  size='medium'
                  onClick={() => handleNavigate('/login')}
                  sx={{ textTransform: 'none', backgroundColor: '#007BFF', fontSize: isTablet ? '0.8rem' : '1rem' }}
                >
                  <Login sx={{ mr: 1 }} /> Login
                </Button>
                <Button
                  variant='contained'
                  size='medium'
                  onClick={() => handleNavigate('/signup')}
                  sx={{ textTransform: 'none', backgroundColor: '#9c27b0', fontSize: isTablet ? '0.8rem' : '1rem' }}
                >
                  <LockOpen sx={{ mr: 1 }} /> Signup
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

export default Navbar;