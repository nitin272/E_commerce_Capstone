import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import {
    Container,
    Box,
    Typography,
    Paper,
    CircularProgress,
    Avatar,
    Chip,
    Button,
    Grid,
    Card,
    CardContent,
    IconButton,
    Tooltip,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    OutlinedInput,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ChatIcon from '@mui/icons-material/Chat';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const apiUrl = "https://e-commerce-capstone.onrender.com";
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${apiUrl}/users`, {
                withCredentials: true
            });
            console.log('Fetched users:', response.data);
            setUsers(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Error fetching users.');
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = searchQuery === '' || 
                user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.username?.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesRole = roleFilter === 'all' || 
                user.role?.toLowerCase() === roleFilter.toLowerCase();
            
            return matchesSearch && matchesRole;
        });
    }, [users, searchQuery, roleFilter]);

    const getRoleColor = (role) => {
        switch (role?.toLowerCase()) {
            case 'admin':
                return 'error';
            case 'user':
                return 'primary';
            default:
                return 'default';
        }
    };

    const getRoleIcon = (role) => {
        switch (role?.toLowerCase()) {
            case 'admin':
                return <AdminPanelSettingsIcon />;
            case 'user':
                return <PersonIcon />;
            default:
                return <PersonIcon />;
        }
    };

    const handleStartChat = (userId, username) => {
        navigate('/chat', { state: { userId, username } });
    };

    if (isLoading) {
        return (
            <Box className="flex items-center justify-center min-h-[400px]">
                <CircularProgress size={24} />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" className="py-8">
            <ToastContainer />
            
            <Box className="mb-8">
                <Typography variant="h4" className="font-bold text-gray-800 mb-2">
                    Users Management
                </Typography>
                <Typography variant="subtitle1" className="text-gray-600">
                    View and manage all registered users
                </Typography>
            </Box>

            {/* Search and Filter Section */}
            <Paper className="p-4 mb-6">
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: <SearchIcon className="text-gray-400 mr-1" />,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Filter by Role</InputLabel>
                            <Select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                label="Filter by Role"
                            >
                                <MenuItem value="all">All Roles</MenuItem>
                                <MenuItem value="admin">Admin</MenuItem>
                                <MenuItem value="user">User</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>

            {/* Results Count */}
            <Box className="mb-4">
                <Typography variant="body2" className="text-gray-600">
                    Showing {filteredUsers.length} of {users.length} users
                </Typography>
            </Box>

            {/* Users Grid */}
            <Grid container spacing={3}>
                {filteredUsers.map((user) => (
                    <Grid item xs={12} sm={6} md={4} key={user._id}>
                        <Card 
                            className="h-full hover:shadow-lg transition-shadow duration-300"
                            sx={{ 
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: 'divider',
                            }}
                        >
                            <CardContent className="p-4">
                                <Box className="flex items-start justify-between mb-4">
                                    <Box className="flex items-center gap-3">
                                        <Avatar 
                                            src={user.ownerImg?.[0]} 
                                            alt={user.name}
                                            className="bg-blue-100 text-blue-600 w-12 h-12"
                                        >
                                            {user.name?.charAt(0)}
                                        </Avatar>
                                        <Box>
                                            <Typography className="font-semibold text-gray-800">
                                                {user.name}
                                            </Typography>
                                            <Chip
                                                icon={getRoleIcon(user.role)}
                                                label={user.role || 'User'}
                                                color={getRoleColor(user.role)}
                                                size="small"
                                                className="mt-1"
                                            />
                                        </Box>
                                    </Box>
                                    <Tooltip title="Start Chat">
                                        <IconButton
                                            onClick={() => handleStartChat(user._id, user.name)}
                                            className="bg-blue-50 hover:bg-blue-100"
                                        >
                                            <ChatIcon className="text-blue-600" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>

                                <Box className="space-y-3">
                                    <Box className="bg-blue-50 p-3 rounded-lg">
                                        <Box className="flex items-center gap-2 mb-1">
                                            <EmailIcon className="text-blue-500" fontSize="small" />
                                            <Typography className="text-sm text-blue-600 font-medium">
                                                Email Address
                                            </Typography>
                                        </Box>
                                        <Typography className="text-blue-800 text-sm">
                                            {user.email || user.username || 'No email available'}
                                        </Typography>
                                    </Box>

                                    {user.phone && (
                                        <Box className="bg-gray-50 p-3 rounded-lg">
                                            <Box className="flex items-center gap-2 mb-1">
                                                <PhoneIcon className="text-gray-500" fontSize="small" />
                                                <Typography className="text-sm text-gray-600 font-medium">
                                                    Phone Number
                                                </Typography>
                                            </Box>
                                            <Typography className="text-gray-700 text-sm">
                                                {user.phone}
                                            </Typography>
                                        </Box>
                                    )}

                                    {user.location && (
                                        <Box className="bg-gray-50 p-3 rounded-lg">
                                            <Box className="flex items-center gap-2 mb-1">
                                                <LocationOnIcon className="text-gray-500" fontSize="small" />
                                                <Typography className="text-sm text-gray-600 font-medium">
                                                    Location
                                                </Typography>
                                            </Box>
                                            <Typography className="text-gray-700 text-sm">
                                                {user.location}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Users;
