import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Card, CardContent, Typography, Button, Grid, CircularProgress } from '@mui/material';
import Navbar from './Navbar.jsx';
import Footer from './footer.jsx';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [isEnquiring, setIsEnquiring] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const apiUrl = "https://e-commerce-capstone.onrender.com";

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${apiUrl}/products/${id}`, {
                    withCredentials: true
                });
                setProduct(response.data);
            } catch (err) {
                setError('Failed to fetch product details.');
                console.error('Error fetching product details:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, apiUrl]);

    if (loading) return <div className="text-center p-5"><CircularProgress /></div>;
    if (error) return <div className="text-center p-5">Error: {error}</div>;

    const handleEnquiry = async (product) => {
        setIsEnquiring(true);
        try {
            const { productName, category, description, productImgUrls, _id } = product;
            const productUrl = `${window.location.origin}/products/${_id}`;
            const imageUrl = productImgUrls[0];

            const whatsappMessage = `Hello! 🌟\n\n` +
                `I'm interested in learning more about the following product:\n\n` +
                `*Product Name:* ${productName}\n` +
                `*Category:* ${category}\n` +
                `*Description:* ${description.slice(0, 100)}...\n\n` +
                `*Product Link:* ${productUrl}\n` +
                `*Image:* ${imageUrl}\n\n` +
                `Could you please provide more details? Thank you! 🙏`;

            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappUrl = `https://wa.me/${9413262126}?text=${encodedMessage}`;
            window.open(whatsappUrl, '_blank');
        } catch (error) {
            console.error('Error opening WhatsApp:', error);
        } finally {
            setIsEnquiring(false);
        }
    };

    const stockStatus = (stock) => {
        if (stock === 0) {
            return { status: 'No stock available', color: 'error' };
        } else if (stock < 10) {
            return { status: 'Limited stock', color: 'warning' };
        } else {
            return { status: 'In stock', color: 'success' };
        }
    };

    const { status, color } = stockStatus(product.stock);

    return (
        <>
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 mt-12" style={{marginTop:"15vh"}}>
                <Typography
                    variant="h3"
                    component="h1"
                    align="center"
                    gutterBottom
                    style={{
                        fontWeight: 'bold',
                        color: '#333',
                        textShadow: '1px 1px 1px rgba(255, 255, 255, 0.7)',
                        marginBottom: '20px',
                    }}
                >
                    {product.productName}
                </Typography>

                <Carousel className="mt-4">
                    {product.productImgUrls.map((img, index) => (
                        <div key={index} className="flex justify-center">
                            <img
                                src={img}
                                alt={`${product.productName} - Image ${index + 1}`}
                                style={{
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                    width: '100%',
                                    maxHeight: '400px',
                                    objectFit: 'cover',
                                }}
                            />
                        </div>
                    ))}
                </Carousel>

                <Card elevation={6} style={{ marginTop: '24px', borderRadius: '12px', backgroundColor: '#f9f9f9' }}>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle1" style={{ fontWeight: '600' }}>
                                    <strong>Category:</strong> {product.category}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle1" style={{ fontWeight: '600', color: color }}>
                                    <strong>Stock:</strong> {status}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle1" style={{ fontWeight: '600' }}>
                                    <strong>Price:</strong> ${product.price}
                                </Typography>
                            </Grid>
                        </Grid>

                        <Typography variant="body1" color="textSecondary" paragraph style={{ marginTop: '16px' }}>
                            {product.description}
                        </Typography>

                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleEnquiry(product)}
                                disabled={isEnquiring}
                                style={{
                                    padding: '10px 20px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                }}
                            >
                                {isEnquiring ? <CircularProgress size={24} /> : 'Enquiry'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <Footer />
        </>
    );
};

export default ProductDetail;
