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
      <div className='flex items-center cursor-pointer'>
        <img src={logo} alt="logo" className='h-16 object-cover mr-4' />
        <Typography variant="h4" component="h1" sx={{ fontFamily: 'serif', fontWeight: 'bold', color: '#001F2B' }}>
          Balaji-Electronic
        </Typography>
      </div>
      <div className='flex items-center'>
        {isMobile ? (
          <div>
            <IconButton
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ ml: 2, color: 'black' }}
            >
              <MenuIcon sx={{ fontSize: '7vh', color: 'black' }} />
            </IconButton>
            <Drawer
              anchor='right'
              open={drawerOpen}
              onClose={toggleDrawer(false)}
              onOpen={toggleDrawer(true)}
            >
              <div className='w-64'>
                <List>
                  <ListItem>
                    <Typography 
                      variant="body1" // Changed to body1 for larger text
                      sx={{ 
                        fontFamily: 'serif', 
                        fontWeight: 'bold', 
                        color: '#001F2B', 
                        fontSize: '2rem' // Increased the font size
                      }}
                    >
                      <span className='font-bold text-2xl'>
                        {Object.keys(userData).length > 0 ? 'Welcome Back ' : 'Welcome '}
                      </span>
                      <span className='font-bold text-3xl'>{userData.name}</span>
                    </Typography>
                  </ListItem>

                  <Divider />
                  {Object.keys(userData).length > 0 ? (
                    <>
                      <ListItem button onClick={() => handleNavigate('/')} sx={{ textAlign: 'left', py: 2 }}>
                        <Home sx={{ mr: 2 }} /> <ListItemText primary="Home" />
                      </ListItem>
                      <ListItem button onClick={() => handleNavigate('/product')} sx={{ textAlign: 'left', py: 2 }}>
                        <Category sx={{ mr: 2 }} /> <ListItemText primary="Products" />
                      </ListItem>
                      <ListItem button onClick={() => handleNavigate('/profile')} sx={{ textAlign: 'left', py: 2 }}>
                        <AccountCircle sx={{ mr: 2 }} /> <ListItemText primary="Profile" />
                      </ListItem>
                      <ListItem button onClick={() => handleNavigate('/chat')} sx={{ textAlign: 'left', py: 2 }}>
                        <Chat sx={{ mr: 2 }} /> <ListItemText primary="Chats" />
                      </ListItem>
                      <ListItem button onClick={() => handleNavigate('/contact')} sx={{ textAlign: 'left', py: 2 }}>
                        <ContactMail sx={{ mr: 2 }} /> <ListItemText primary="Contact Us" />
                      </ListItem>
                      {isAdmin && (
                        <ListItem button onClick={() => handleNavigate('/dashboard')} sx={{ textAlign: 'left', py: 2 }}>
                          <Dashboard sx={{ mr: 2 }} /> <ListItemText primary="Dashboard" />
                        </ListItem>
                      )}
                      <ListItem button onClick={logout} sx={{ textAlign: 'left', py: 2 }}>
                        <Logout sx={{ mr: 2 }} /> <ListItemText primary="Logout" />
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
          </div>
        ) : (
          <div className='flex items-center gap-x-4 ml-8'>
            <Typography variant="body1" sx={{ fontFamily: 'serif', color: 'black', fontWeight: 'bold', fontSize: '1.5rem' }}>
              {Object.keys(userData).length > 0 ? `Welcome back ${userData.name}` : 'Welcome Guest'}
            </Typography>
            {Object.keys(userData).length > 0 ? (
              <>
                <Button
                  variant='contained'
                  size='large'
                  onClick={() => handleNavigate('/product')}
                  sx={{ textTransform: 'none', py: 1.5, backgroundColor: '#007BFF', '&:hover': { backgroundColor: '#0056b3' }, fontSize: '1rem' }}
                >
                  <Category sx={{ mr: 1 }} /> Products
                </Button>
                <Button
                  variant='contained'
                  size='large'
                  onClick={() => handleNavigate('/profile')}
                  sx={{ textTransform: 'none', py: 1.5, backgroundColor: '#9c27b0', '&:hover': { backgroundColor: '#7b1fa2' }, fontSize: '1rem' }}
                >
                  <AccountCircle sx={{ mr: 1 }} /> Profile
                </Button>
                <Button
                  variant='contained'
                  size='large'
                  onClick={() => handleNavigate('/chat')}
                  sx={{ textTransform: 'none', py: 1.5, backgroundColor: '#FF9800', '&:hover': { backgroundColor: '#FB8C00' }, fontSize: '1rem' }}
                >
                  <Chat sx={{ mr: 1 }} /> Chats
                </Button>
                <Button
                  variant='contained'
                  size='large'
                  onClick={() => handleNavigate('/contact')}
                  sx={{ textTransform: 'none', py: 1.5, backgroundColor: '#009688', '&:hover': { backgroundColor: '#00796B' }, fontSize: '1rem' }}
                >
                  <ContactMail sx={{ mr: 1 }} /> Contact Us
                </Button>
                {isAdmin && (
                  <Button
                    variant='contained'
                    size='large'
                    onClick={() => handleNavigate('/dashboard')}
                    sx={{ textTransform: 'none', py: 1.5, backgroundColor: '#388E3C', '&:hover': { backgroundColor: '#2E7D32' }, fontSize: '1rem' }}
                  >
                    <Dashboard sx={{ mr: 1 }} /> Dashboard
                  </Button>
                )}
                <Button
                  variant='contained'
                  size='large'
                  onClick={logout}
                  sx={{ textTransform: 'none', py: 1.5, backgroundColor: '#F44336', '&:hover': { backgroundColor: '#D32F2F' }, fontSize: '1rem' }}
                >
                  <Logout sx={{ mr: 1 }} /> Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant='contained'
                  size='large'
                  onClick={() => handleNavigate('/login')}
                  sx={{ textTransform: 'none', py: 1.5, backgroundColor: '#007BFF', '&:hover': { backgroundColor: '#0056b3' }, fontSize: '1rem' }}
                >
                  <Login sx={{ mr: 1 }} /> Login
                </Button>
                <Button
                  variant='contained'
                  size='large'
                  onClick={() => handleNavigate('/signup')}
                  sx={{ textTransform: 'none', py: 1.5, backgroundColor: '#9c27b0', '&:hover': { backgroundColor: '#7b1fa2' }, fontSize: '1rem' }}
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
