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
  TextField,
  Chip,
  IconButton,
  Tooltip,
  Grid,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import { motion, AnimatePresence } from 'framer-motion';
import { Message, Search, FilterList, Refresh, AdminPanelSettings, Person } from '@mui/icons-material';
import toast from 'react-hot-toast';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const navigate = useNavigate();
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [filterRole, setFilterRole] = useState('all');

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(`${apiUrl}/login/success`, { withCredentials: true });
      setCurrentUser(response.data.user);
    } finally {
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/users`, { withCredentials: true });
      setUsers(response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchUsers();
  }, []);

  if (loading) return <Loading />;

  if (users.length === 0) {
    return (
      <Box padding={3}>
        <Typography variant="h5">No users available.</Typography>
      </Box>
    );
  }

  const currentUserId = currentUser?._id;

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterSelect = (role) => {
    setFilterRole(role);
    handleFilterClose();
    toast.success(`Filtered by ${role === 'all' ? 'all users' : role} role`);
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      await fetchUsers();
      await fetchCurrentUser();
      toast.success('User list refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh user list');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = 
      filterRole === 'all' || 
      user.role.toLowerCase() === filterRole.toLowerCase();

    return String(user._id) !== String(currentUser?._id) && matchesSearch && matchesRole;
  });

  const handleStartChat = (userId, username) => {
    navigate('/chat', { state: { userId, username } });
  };

  return (
    <Box className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Box className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Enhanced Header Section */}
          <Box className="mb-12 text-center relative">
            <motion.div 
              className="absolute inset-0 -z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
            </motion.div>
            
            <Typography 
              variant="h2" 
              className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4"
            >
              User Directory
            </Typography>
            <Typography variant="h6" className="text-gray-600 max-w-2xl mx-auto">
              Manage and connect with our community members in one place
            </Typography>
          </Box>

          {/* Updated Action Bar */}
          <Box className="mb-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            <Paper 
              elevation={0}
              className="flex-grow md:max-w-md p-2 bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50"
            >
              <Box className="flex items-center gap-3 px-3">
                <Search className="text-gray-400" />
                <TextField
                  variant="standard"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  fullWidth
                  InputProps={{
                    disableUnderline: true,
                    className: "text-lg"
                  }}
                />
              </Box>
            </Paper>
            
            <Box className="flex gap-2">
              <Tooltip title="Refresh List">
                <IconButton 
                  onClick={handleRefresh}
                  className="bg-white/80 hover:bg-white shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <Refresh />
                </IconButton>
              </Tooltip>
              <Tooltip title="Filter Users">
                <IconButton 
                  onClick={handleFilterClick}
                  className="bg-white/80 hover:bg-white shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <FilterList />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Filter Menu */}
            <Menu
              anchorEl={filterAnchorEl}
              open={Boolean(filterAnchorEl)}
              onClose={handleFilterClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{
                className: "mt-2 bg-white/90 backdrop-blur-lg"
              }}
            >
              <MenuItem onClick={() => handleFilterSelect('all')}>
                <ListItemIcon>
                  <Person fontSize="small" />
                </ListItemIcon>
                <ListItemText>All Users</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => handleFilterSelect('admin')}>
                <ListItemIcon>
                  <AdminPanelSettings fontSize="small" />
                </ListItemIcon>
                <ListItemText>Admins Only</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => handleFilterSelect('user')}>
                <ListItemIcon>
                  <Person fontSize="small" />
                </ListItemIcon>
                <ListItemText>Regular Users</ListItemText>
              </MenuItem>
            </Menu>
          </Box>

          <AnimatePresence mode="wait">
            {loading ? (
              <Loading />
            ) : filteredUsers.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16"
              >
                <Typography variant="h5" className="text-gray-600">
                  No users found matching your criteria.
                </Typography>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <TableContainer 
                  component={Paper} 
                  elevation={0}
                  className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 overflow-hidden"
                >
                  <Table>
                    <TableHead>
                      <TableRow className="bg-gray-50/50">
                        <TableCell className="font-semibold">Photo</TableCell>
                        <TableCell className="font-semibold">Name</TableCell>
                        <TableCell className="font-semibold">Email</TableCell>
                        <TableCell className="font-semibold">Role</TableCell>
                        <TableCell className="font-semibold">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredUsers.map((user, index) => (
                        <motion.tr
                          key={user._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          component={TableRow}
                          className="hover:bg-gray-50/50 transition-colors duration-200"
                        >
                          <TableCell>
                            <Avatar
                              src={user.ownerImg[0]}
                              alt={user.name}
                              className="w-12 h-12 ring-2 ring-offset-2 ring-blue-100"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle1" className="font-medium">
                              {user.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" className="text-gray-600">
                              {user.username}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={user.role === 'admin' ? 'ADMIN' : 'USER'}
                              color={user.role === 'admin' ? 'success' : 'primary'}
                              variant="outlined"
                              size="small"
                              className="font-medium"
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              startIcon={<Message />}
                              onClick={() => handleStartChat(user._id, user.username)}
                              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white normal-case px-6 rounded-xl shadow-blue-200 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                              Chat
                            </Button>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Box>
    </Box>
  );
};

export default Users;
