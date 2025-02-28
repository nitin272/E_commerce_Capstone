import React, { useState } from 'react';
import axios from 'axios';
import {
    Button,
    Container,
    Box,
    Typography,
    Divider,
    Tabs,
    Tab,
    Paper,
} from '@mui/material';
import { Person, Storefront, Dashboard as DashboardIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/footer.jsx';
import Navbar from '../components/Navbar';
import Users from './user';
import Products from './ProductList';

const AdminPanel = () => {
    const [selectedSection, setSelectedSection] = useState('users');
    const apiUrl = import.meta.env.VITE_APP_API_URL;

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

    return (
        <Box className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 mt-12">
            <Navbar />
            
            <Container maxWidth="2xl" className="px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Enhanced Dashboard Header */}
                    <Box className="mb-12 text-center relative">
                        <motion.div 
                            className="absolute inset-0 -z-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                        >
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-purple-400/5 rounded-full blur-3xl" />
                        </motion.div>
                        
                        <Box className="relative z-10">
                            <Typography 
                                variant="h2" 
                                className="text-6xl font-bold bg-gradient-to-r from-blue-700 via-purple-700 to-blue-700 bg-clip-text text-transparent mb-6"
                            >
                                Admin Dashboard
                            </Typography>
                            <Typography variant="h6" className="text-gray-600 max-w-2xl mx-auto font-light">
                                Manage your store's products and users with powerful administrative tools
                            </Typography>
                        </Box>
                    </Box>

                    {/* Modernized Navigation Tabs */}
                    <Box className="mb-8 sticky top-20 z-50">
                        <Tabs
                            value={selectedSection}
                            onChange={handleTabChange}
                            variant="fullWidth"
                            className="min-h-[72px]"
                            TabIndicatorProps={{
                                style: {
                                    height: '3px',
                                    borderRadius: '8px',
                                    background: 'linear-gradient(to right, #2563eb, #7c3aed)',
                                }
                            }}
                        >
                            <Tab
                                value="users"
                                label={
                                    <Box className="flex items-center gap-2">
                                        <Person className="text-blue-600" />
                                        <span>Users Management</span>
                                    </Box>
                                }
                                className="transition-all duration-300"
                                sx={{
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    minHeight: 72,
                                }}
                            />
                            <Tab
                                value="products"
                                label={
                                    <Box className="flex items-center gap-2">
                                        <Storefront className="text-purple-600" />
                                        <span>Products Management</span>
                                    </Box>
                                }
                                className="transition-all duration-300"
                                sx={{
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    minHeight: 72,
                                }}
                            />
                        </Tabs>
                    </Box>

                    {/* Content Section - Without Paper background */}
                    <Box className="relative">
                        <AnimatePresence mode="wait">
                            {selectedSection === 'users' && (
                                <motion.div
                                    key="users"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                >
                                    <Users />
                                </motion.div>
                            )}
                            {selectedSection === 'products' && (
                                <motion.div
                                    key="products"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                >
                                    <Products handleEditProduct={handleEditProduct} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Box>
                </motion.div>
            </Container>
            
            <Footer />
        </Box>
    );
};

export default AdminPanel;
