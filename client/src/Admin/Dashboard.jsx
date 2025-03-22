import React, { useState, Suspense, lazy, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Box,
    Typography,
    Tabs,
    Tab,
    CircularProgress,
    useTheme,
    useMediaQuery,
    Paper,
    Grid,
} from '@mui/material';
import { Person, Storefront, Dashboard as DashboardIcon } from '@mui/icons-material';
import Lottie from 'lottie-react';
// import dashboardAnimation from '../assets/dashboard.json';
import loadingAnimation from '../assets/animations/loading.json';
import Footer from '../components/footer.jsx';
import Navbar from '../components/Navbar';

// Lazy load components with preloading
const Users = lazy(() => import('./user'));
const Products = lazy(() => import('./ProductList'));

const AdminPanel = () => {
    const [selectedSection, setSelectedSection] = useState('users');
    const [isLoading, setIsLoading] = useState(true);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const apiUrl = "https://e-commerce-capstone.onrender.com";

    useEffect(() => {
        // Simulate initial loading
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleEditProduct = async (productId, updatedData) => {
        try {
            await axios.put(`${apiUrl}/product/update/${productId}`, updatedData);
            alert('Product updated');
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const handleTabChange = (_, newValue) => {
        setSelectedSection(newValue);
    };

    // Enhanced loading component with Lottie animation
    const LoadingComponent = () => (
        <Box className="flex flex-col items-center justify-center min-h-[400px]">
            <Lottie 
                animationData={loadingAnimation} 
                loop={true} 
                style={{ width: 200, height: 200 }}
            />
            <Typography variant="body1" className="text-gray-600 mt-4">
                Loading content...
            </Typography>
        </Box>
    );

    if (isLoading) {
        return (
            <Box className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white">
               
                <Typography variant="h5" className="text-gray-700 mt-4">
                    Welcome to Admin Dashboard
                </Typography>
                <Typography variant="body2" className="text-gray-500">
                    Loading your workspace...
                </Typography>
            </Box>
        );
    }

    return (
        <Box className="min-h-screen bg-gradient-to-br from-blue-50 to-white mt-14">
            <Navbar />
            
            <Container maxWidth="2xl" className="px-4 py-8">
                {/* Dashboard Header - Enhanced */}
                <Paper 
                    elevation={0}
                    className="p-6 mb-8 bg-white rounded-xl shadow-sm border border-gray-100"
                >
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={8}>
                            <Box className="flex items-center gap-3 mb-2">
                                <DashboardIcon className="text-blue-600 text-3xl" />
                                <Typography 
                                    variant="h4" 
                                    className="text-2xl font-bold text-gray-800"
                                >
                                    Admin Dashboard
                                </Typography>
                            </Box>
                            <Typography 
                                variant="body1" 
                                className="text-gray-600"
                            >
                                Manage your store efficiently with powerful tools and insights
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box className="flex justify-end">
                               
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Navigation Tabs - Enhanced */}
                <Paper 
                    elevation={0}
                    className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100"
                >
                    <Tabs
                        value={selectedSection}
                        onChange={handleTabChange}
                        variant={isMobile ? "fullWidth" : "standard"}
                        className="min-h-[56px] px-4"
                        sx={{
                            '& .MuiTabs-flexContainer': {
                                gap: 2,
                            },
                            '& .MuiTab-root': {
                                minHeight: '56px',
                                textTransform: 'none',
                                fontSize: '1rem',
                                fontWeight: 500,
                                color: 'text.secondary',
                                transition: 'all 0.3s ease',
                                '&.Mui-selected': {
                                    color: 'primary.main',
                                    fontWeight: 600,
                                    transform: 'translateY(-1px)',
                                },
                                '&:hover': {
                                    color: 'primary.main',
                                },
                            },
                        }}
                    >
                        <Tab
                            value="users"
                            label={
                                <Box className="flex items-center gap-2">
                                    <Person className="text-xl" />
                                    <span className="hidden sm:inline">Users Management</span>
                                </Box>
                            }
                        />
                        <Tab
                            value="products"
                            label={
                                <Box className="flex items-center gap-2">
                                    <Storefront className="text-xl" />
                                    <span className="hidden sm:inline">Products Management</span>
                                </Box>
                            }
                        />
                    </Tabs>
                </Paper>

                {/* Content Section - Enhanced */}
                <Paper 
                    elevation={0}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                >
                    <Suspense fallback={<LoadingComponent />}>
                        {selectedSection === 'users' && <Users />}
                        {selectedSection === 'products' && <Products handleEditProduct={handleEditProduct} />}
                    </Suspense>
                </Paper>
            </Container>
            
            <Footer />
        </Box>
    );
};

export default AdminPanel;