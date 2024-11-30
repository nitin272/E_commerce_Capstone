import React, { useEffect, useState, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/logo.png";
import axios from 'axios';
import {
  Button, IconButton, Drawer, List, ListItem, Typography, Avatar, Dialog, DialogActions, DialogContent, DialogTitle,
  useMediaQuery, BottomNavigation, BottomNavigationAction, Menu, MenuItem, Box,
} from '@mui/material';
import {
  Category, Chat, AccountCircle, Logout, Login, ContactMail, Home, Dashboard,ArrowDropDown,
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
  const apiUrl = import.meta.env.VITE_APP_API_URL;

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
      setDialogOpen(true); // Open dialog if not logged in
    } else {
      navigate('/chat'); // Navigate to chat if logged in
    }
  };

  // Close dialog
  const handleDialogClose = (action) => {
    setDialogOpen(false);
    if (action === 'login') navigate('/login'); // Redirect to login if user selects "Login"
  };
  
  

  return (
    <div>
      <Toaster 
  position="top-center" 
  reverseOrder={false} 
/>

      {/* Top Navbar */}
      <div className='fixed top-0 left-0 right-0 flex justify-between items-center p-3 shadow-md w-full bg-white z-50'>
        <div className='flex items-center cursor-pointer'>
          <img src={logo} alt="logo" className={`h-12 object-cover mr-2 ${isTablet ? 'h-10' : 'h-16'}`} />
          <Typography
            variant="h5"
            component="h4"
            className={`text-xl ${isTablet ? 'text-lg' : 'text-2xl'} font-bold`}
            sx={{ fontFamily: 'serif', color: '#001F2B' }}
          >
            Scale Mart
          </Typography>
        </div>

        {!isMobile && (
  <div className='flex items-center gap-x-3'>
    {Object.keys(userData).length > 0 ? (
      <>
        <Button
          variant='contained'
          onClick={() => handleNavigate('/')}  
          sx={{ textTransform: 'none', backgroundColor: '#4CAF50' }}  
        >
          <Home sx={{ mr: 1 }} /> Home
        </Button>
        <Button
          variant='contained'
          onClick={() => handleNavigate('/product')}
          sx={{ textTransform: 'none', backgroundColor: '#007BFF' }}
        >
          <Category sx={{ mr: 1 }} /> Products
        </Button>
        <Button
          variant='contained'
          onClick={() => handleNavigate('/profile')}
          sx={{ textTransform: 'none', backgroundColor: '#9c27b0' }}
        >
          <AccountCircle sx={{ mr: 1 }} /> Profile
        </Button>
        {isAdmin && (
          <Button
            variant='contained'
            onClick={() => handleNavigate('/dashboard')}
            sx={{ textTransform: 'none', backgroundColor: '#388E3C' }}
          >
            <Dashboard sx={{ mr: 1 }} /> Dashboard
          </Button>
        )}
        <Button
          variant='contained'
          onClick={handleChatClick}
          sx={{ textTransform: 'none', backgroundColor: '#FF9800' }}
        >
          <Chat sx={{ mr: 1 }} /> Chat
        </Button>
        <Button
          variant='contained'
          onClick={logout}
          sx={{ textTransform: 'none', backgroundColor: '#F44336' }}
        >
          <Logout sx={{ mr: 1 }} /> Logout
        </Button>
      </>
            ) : (
              <>
                <Button
                  variant='contained'
                  onClick={() => handleNavigate('/login')}
                  sx={{ textTransform: 'none', backgroundColor: '#007BFF' }}
                >
                  <Login sx={{ mr: 1 }} /> Login
                </Button>
                <Button
                  variant='contained'
                  onClick={() => handleNavigate('/signup')}
                  sx={{ textTransform: 'none', backgroundColor: '#6a1b9a' }}
                >
                  <Login sx={{ mr: 1 }} /> Sign-Up
                </Button>
              </>
            )}
          </div>
        )}

        {/* Mobile Dropdown */}
        {isMobile && (
  <div className="flex items-center space-x-2">
    <IconButton onClick={handleMenuOpen} aria-label="user menu">
      {Object.keys(userData).length > 0 ? (
        // Render Avatar and the down-facing arrow when user is logged in
        <div className="flex items-center space-x-1">
          <Avatar alt="User Avatar" src={userData.ownerImg[0]} sx={{ width: 32, height: 32 }} />
          <ArrowDropDown fontSize="large" />
        </div>
      ) : (
        <Login fontSize="large" />
      )}
    </IconButton>

    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      PaperProps={{
        style: {
          width: '200px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
     {Object.keys(userData).length > 0 ? (
        <>
          <MenuItem
            onClick={() => handleNavigate('/profile')}
            className="hover:bg-gray-100 transition duration-150"
          >
            <AccountCircle sx={{ color: '#FFA000', fontSize: '1.5rem' }} className="mr-2" />  {/* Yellow profile icon */}
            Profile
          </MenuItem>
          {isAdmin && (
            <MenuItem
              onClick={() => handleNavigate('/dashboard')}
              className="hover:bg-gray-100 transition duration-150"
            >
              <Dashboard sx={{ color: '#4CAF50', fontSize: '1.5rem' }} className="mr-2" />  {/* Green dashboard icon */}
              Dashboard
            </MenuItem>
          )}
          <MenuItem
            onClick={logout}
            className="hover:bg-gray-100 transition duration-150"
          >
            <Logout sx={{ color: '#D32F2F', fontSize: '1.5rem' }} className="mr-2" />  {/* Red logout icon */}
            Logout
          </MenuItem>
        </>
      ) : (
        <MenuItem
          onClick={() => handleNavigate('/login')}
          className="hover:bg-gray-100 transition duration-150"
        >
          <Login sx={{ color: '#1976D2', fontSize: '1.5rem' }} className="mr-2" />  {/* Blue login icon */}
          Login
        </MenuItem>
      )}
    </Menu>
  </div>
)}
</div>
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



      {/* Bottom Navigation for Mobile */}
      {isMobile && (
  <BottomNavigation
    showLabels
    value={value}
    onChange={(event, newValue) => setValue(newValue)}
    className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-300"
  >
    <BottomNavigationAction
      label="Home"
      icon={<Home />}
      onClick={() => handleNavigate('/')}
      sx={{
        color: '#1976D2', // Blue for home
        '&.Mui-selected': {
          color: '#1565C0', // Darker blue when selected
        },
        '&:hover': {
          color: '#1565C0', // Dark blue on hover
        },
      }}
    />
    <BottomNavigationAction
      label="Chat"
      icon={<Chat />}
      onClick={handleChatClick}
      sx={{
        color: '#4CAF50', // Green for chat
        '&.Mui-selected': {
          color: '#388E3C', // Darker green when selected
        },
        '&:hover': {
          color: '#388E3C', // Dark green on hover
        },
      }}
    />
    <BottomNavigationAction
      label="Products"
      icon={<Category />}
      onClick={() => handleNavigate('/product')}
      sx={{
        color: '#FF9800', // Orange for products
        '&.Mui-selected': {
          color: '#F57C00', // Darker orange when selected
        },
        '&:hover': {
          color: '#F57C00', // Dark orange on hover
        },
      }}
    />
    {isAdmin && (
      <BottomNavigationAction
        label="Dashboard"
        icon={<Dashboard />}
        onClick={() => handleNavigate('/dashboard')}
        sx={{
          color: '#9C27B0', // Purple for dashboard (admin)
          '&.Mui-selected': {
            color: '#7B1FA2', // Darker purple when selected
          },
          '&:hover': {
            color: '#7B1FA2', // Dark purple on hover
          },
        }}
      />
    )}
  </BottomNavigation>
)}
    </div>
  );
});

export default Navbar;
