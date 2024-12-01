
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
import { Person, Storefront } from '@mui/icons-material';
import Footer from '../components/footer.jsx';
import Navbar from '../components/Navbar';
import Users from './user';
import Products from './ProductList';

const AdminPanel = () => {
    const [selectedSection, setSelectedSection] = useState('users');
    const apiUrl = "https://e-commerce-capstone.onrender.com";

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
        <Container maxWidth="lg" sx={{ mt: 12, minHeight: '100vh', pb: 8 }}>

            <Navbar />

            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Admin Panel
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage users and products with ease.
                </Typography>
            </Box>

            <Divider sx={{ mb: 4 }} />

            <Paper
                elevation={3}
                sx={{
                    position: 'sticky',
                    top: 64,
                    zIndex: 10,
                    borderRadius: 2,
                }}
            >
                <Tabs
                    value={selectedSection}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                >
                    <Tab
                        value="users"
                        label="Users"
                        icon={<Person />}
                        sx={{
                            textTransform: 'capitalize',
                            fontWeight: 'medium',
                        }}
                    />
                    <Tab
                        value="products"
                        label="Products"
                        icon={<Storefront />}
                        sx={{
                            textTransform: 'capitalize',
                            fontWeight: 'medium',
                        }}
                    />
                </Tabs>
            </Paper>

            <Box sx={{ mt: 4 }}>
                {selectedSection === 'users' && (
                    <Box sx={{ animation: 'fadeIn 0.5s ease-in-out' }}>
                        <Users />
                    </Box>
                )}
                {selectedSection === 'products' && (
                    <Box sx={{ animation: 'fadeIn 0.5s ease-in-out' }}>
                        <Products handleEditProduct={handleEditProduct} />
                    </Box>
                )}
            </Box>

            <Footer />
        </Container>
    );
};

export default AdminPanel;
