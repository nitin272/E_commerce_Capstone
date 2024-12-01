import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Typography,
  Box,
  Button,
  CircularProgress,
  TextField
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); 
  const apiUrl = "https://e-commerce-capstone.onrender.com"; 
  const navigate = useNavigate();


  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(`${apiUrl}/login/success`, { withCredentials: true });
      setCurrentUser(response.data.user); 
    }
     finally {
      
    }
    
  };


  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/users`, { withCredentials: true });
      setUsers(response.data);
    }
     finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser(); 
    fetchUsers();       
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

 
  const currentUserId = currentUser?._id;


  const filteredUsers = users.filter(user => String(user._id) !== String(currentUserId));


  const searchedUsers = filteredUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartChat = (userId, username) => {

    navigate('/chat', { state: { userId, username } });
  };

  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>
      <TextField
        variant="outlined"
        placeholder="Search users by name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        margin="normal"
      />
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
            {searchedUsers.map(user => (
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
                    onClick={() => handleStartChat(user._id, user.username)} 
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
