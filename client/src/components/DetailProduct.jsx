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
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);  // To store all products
    const [isEnquiring, setIsEnquiring] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const apiUrl = import.meta.env.VITE_APP_API_URL;

    useEffect(() => {
        const fetchProductAndAllProducts = async () => {
            try {
                // Fetch current product details
                const response = await axios.get(`${apiUrl}/products/${id}`, { withCredentials: true });
                setProduct(response.data);

                // Fetch all products
                const allProductsResponse = await axios.get(`${apiUrl}/products`, { withCredentials: true });
                setAllProducts(allProductsResponse.data);

                // Filter related products based on category, excluding the current product
                const filteredRelatedProducts = allProductsResponse.data.filter(product => 
                    product.category === response.data.category && product._id !== response.data._id
                );
                setRelatedProducts(filteredRelatedProducts);
            } catch (err) {
                setError('Failed to fetch product details or related products.');
                console.error('Error fetching product details or related products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProductAndAllProducts();
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
        <div className="max-w-7xl mx-auto px-4 mt-12" style={{ marginTop: "15vh" }}>
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
                    textAlign: 'center',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    maxWidth: '800px',
                }}
            >
                {product.productName}
            </Typography>

            {/* Carousel for Product Images */}
            <Carousel className="mt-4">
                {product.productImgUrls && Array.isArray(product.productImgUrls) && product.productImgUrls.length > 0 ? (
                    product.productImgUrls.map((img, index) => (
                        <div key={index} className="flex justify-center">
                            <img
                                src={img}
                                alt={`${product.productName} - Image ${index + 1}`}
                                style={{
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                    width: '100%',
                                    height: 'auto',
                                    maxWidth: '100%',
                                    maxHeight: '400px',
                                    objectFit: 'contain',
                                    backgroundColor: '#f0f0f0', // Light background for image area
                                }}
                            />
                        </div>
                    ))
                ) : (
                    <div>No images available</div>
                )}
            </Carousel>

            {/* Product Details Card */}
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
                        {product.description ? product.description.slice(0, 100) : 'No description available'}
                    </Typography>

                    {/* Enquiry Button */}
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

            {/* Related Products Section */}
            <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f4f4f4' }}>
    <Typography
        variant="h4"
        component="h2"
        align="center"
        gutterBottom
        style={{
            marginBottom: '30px',
            fontWeight: 'bold',
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            color: '#333',
        }}
    >
        Related Products
    </Typography>
    <Grid container spacing={3} justifyContent="center">
        {relatedProducts && relatedProducts.length > 0 ? (
            relatedProducts.map((relatedProduct) => (
                <Grid item xs={12} sm={6} md={4} key={relatedProduct._id}>
                    <Card
                        elevation={3}
                        style={{
                            padding: '16px',
                            borderRadius: '12px',
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: '#fff',
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                            transition: 'transform 0.3s ease-in-out',
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        {/* Image container with background */}
                        <div
                            style={{
                                position: 'relative',
                                width: '100%',
                                height: 'auto',
                                overflow: 'hidden',
                                borderRadius: '8px',
                                backgroundColor: '#e0e0e0',
                            }}
                        >
                            {relatedProduct.productImgUrls && Array.isArray(relatedProduct.productImgUrls) && relatedProduct.productImgUrls.length > 0 ? (
                                <img
                                    src={relatedProduct.productImgUrls[0]} 
                                    alt={`${relatedProduct.productName} - Image 1`}
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        maxHeight: '250px',
                                        objectFit: 'contain',
                                        backgroundColor: '#f0f0f0', // Light background for image area
                                    }}
                                />
                            ) : (
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: '100%',
                                        color: '#888',
                                    }}
                                >
                                    No image available
                                </div>
                            )}
                        </div>

                        {/* Product Name and Price */}
                        <Typography
                            variant="h6"
                            style={{
                                fontWeight: 'bold',
                                textAlign: 'center',
                                marginTop: '12px',
                                fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                                color: '#333',
                            }}
                        >
                            {relatedProduct.productName}
                        </Typography>
                        <Typography
                            variant="body1"
                            style={{
                                textAlign: 'center',
                                marginBottom: '16px',
                                color: '#333',
                                fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                            }}
                        >
                            ₹{relatedProduct.price}
                        </Typography>

                        {/* View Product Button */}
                        <div style={{ textAlign: 'center' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                style={{
                                    fontWeight: 'bold',
                                    padding: '10px 20px',
                                    borderRadius: '20px',
                                    transition: 'background-color 0.3s ease',
                                }}
                                onClick={() => window.location.href = `/products/${relatedProduct._id}`}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                            >
                                View Product
                            </Button>
                        </div>
                    </Card>
                </Grid>
            ))
        ) : (
            <Typography
                variant="body1"
                align="center"
                color="textSecondary"
                style={{
                    width: '100%',
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                }}
            >
                No related products found.
            </Typography>
        )}
    </Grid>
</div>


        </div>
        <Footer />
    </>
);

};

export default ProductDetail;
