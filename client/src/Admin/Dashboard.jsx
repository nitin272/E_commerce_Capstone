// src/pages/AdminPanel.js

import React, { useState } from 'react';
import axios from 'axios';
import { Button, Container, Grid, Box, Typography, Card, CardContent } from '@mui/material';
import { Person, Storefront } from '@mui/icons-material'; // Icons for Users and Products
import Footer from '../components/footer.jsx'; // Import Footer
import Navbar from '../components/Navbar';
import Users from './user'; 
import Products from './ProductList'; 

const AdminPanel = () => {
    const [selectedSection, setSelectedSection] = useState('users'); // State for selected section
    const apiUrl = import.meta.env.VITE_APP_API_URL;

    const handleEditProduct = async (productId, updatedData) => {
        try {
            await axios.put(`${apiUrl}/product/update/${productId}`, updatedData);
            alert('Product updated');
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    return (
        <Box sx={{
            backgroundColor: '#f0f2f5', // Light mode background
            marginTop:"18vh",
            minHeight: '100vh',
            color: '#333',
            transition: 'background-color 0.3s ease, color 0.3s ease', // Smooth transition
            paddingBottom: '50px', // Ensure footer is not overlapping
        }}>
            <Navbar />
            
            {/* Central Container for the Admin Panel */}
            <Container maxWidth="lg" sx={{ mt: 5 }}>
                <Card sx={{
                    boxShadow: 6,
                    borderRadius: 3,
                    padding: '30px 40px',
                    backgroundColor: '#ffffff', // Card background in light mode
                    color: '#000',
                    transition: 'background-color 0.3s ease, color 0.3s ease',
                    '&:hover': {
                        transform: 'scale(1.02)', // Card scaling effect on hover
                        boxShadow: 8,
                    },
                }}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 4
                    }}>
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                            Admin Panel
                        </Typography>
                    </Box>

                    {/* Navigation for Users and Products in one line */}
                    <Grid container spacing={2} justifyContent="center" sx={{ mb: 4 }}>
                        <Grid item>
                            <Button
                                variant={selectedSection === 'users' ? 'contained' : 'outlined'}
                                startIcon={<Person />}
                                color="primary"
                                onClick={() => setSelectedSection('users')}
                                sx={{
                                    padding: '10px 20px',
                                    fontWeight: selectedSection === 'users' ? 'bold' : 'normal',
                                    boxShadow: selectedSection === 'users' ? 3 : 0,
                                    '&:hover': { 
                                        transform: 'scale(1.05)', 
                                        boxShadow: 6 
                                    },
                                    transition: 'all 0.2s ease',
                                    borderRadius: '20px', // Rounded corners for buttons
                                }}
                            >
                                Users
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant={selectedSection === 'products' ? 'contained' : 'outlined'}
                                startIcon={<Storefront />}
                                color="primary"
                                onClick={() => setSelectedSection('products')}
                                sx={{
                                    padding: '10px 20px',
                                    fontWeight: selectedSection === 'products' ? 'bold' : 'normal',
                                    boxShadow: selectedSection === 'products' ? 3 : 0,
                                    '&:hover': { 
                                        transform: 'scale(1.05)', 
                                        boxShadow: 6 
                                    },
                                    transition: 'all 0.2s ease',
                                    borderRadius: '20px', // Rounded corners for buttons
                                }}
                            >
                                Products
                            </Button>
                        </Grid>
                    </Grid>

                    {/* Section Transitions */}
                    <CardContent sx={{ p: 0 }}>
                        <Box sx={{
                            transition: 'opacity 0.5s ease-in-out, visibility 0.5s ease-in-out', // Smooth section transition
                            opacity: selectedSection === 'users' ? 1 : 0,
                            visibility: selectedSection === 'users' ? 'visible' : 'hidden',
                        }}>
                            {selectedSection === 'users' && <Users />}
                        </Box>

                        <Box sx={{
                            transition: 'opacity 0.5s ease-in-out, visibility 0.5s ease-in-out',
                            opacity: selectedSection === 'products' ? 1 : 0,
                            visibility: selectedSection === 'products' ? 'visible' : 'hidden',
                        }}>
                            {selectedSection === 'products' && <Products handleEditProduct={handleEditProduct} />}
                        </Box>
                    </CardContent>
                </Card>
            </Container>

            <Footer />
        </Box>
    );
};

export default AdminPanel;
