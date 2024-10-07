import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Typography, Box, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); // State for current user
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_APP_API_URL; // Ensure this URL is correct
  const navigate = useNavigate();

  // Function to fetch current user
  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(`${apiUrl}/login/success`, { withCredentials: true });
      setCurrentUser(response.data.user); // Set the user object directly
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  // Function to fetch users from the server
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/users`, { withCredentials: true });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser(); // Fetch the current user first
    fetchUsers();       // Fetch the list of users
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
        <Typography variant="h6" style={{ marginLeft: '20px' }}>Loading users...</Typography>
      </Box>
    );
  }

  if (users.length === 0) {
    return (
      <Box padding={3}>
        <Typography variant="h5">No users available.</Typography>
      </Box>
    );
  }

  // Log the current user's ID for comparison
  const currentUserId = currentUser?._id;

  // Filter out the current user from the users list
  const filteredUsers = users.filter(user => {
    return String(user._id) !== String(currentUserId);
  });

  const handleStartChat = (userId, username) => {
    // Pass both userId and username (email) to the chat component
    navigate('/chat', { state: { userId, username } });
  };

  return (
    <Box padding={-5}>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Photo</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map(user => (
              <TableRow key={user._id}>
                <TableCell>
                  <Avatar
                    src={user.ownerImg[0]}
                    alt="User"
                    sx={{ width: 60, height: 60, border: '2px solid #ddd' }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body1" fontWeight="bold">
                    {user.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="textSecondary">
                    {user.username}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color={user.role === 'admin' ? 'success.main' : 'info.main'}>
                    {user.role === 'admin' ? 'ADMIN' : 'USER'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleStartChat(user._id, user.username)} // Pass both userId and username
                    sx={{
                      '&:hover': {
                        backgroundColor: 'darkblue',
                      },
                    }}
                  >
                    Start Chat
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Users;
