import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Alert, AlertTitle, CircularProgress, Typography, Card, CardContent, CardMedia,Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Navbar from './Navbar';
import Footer from './footer.jsx';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import axios from 'axios';
import SearchFilter from './Search'; // Import the SearchFilter component
import { Login } from '@mui/icons-material';
import { Login as LoginIcon } from '@mui/icons-material'; 


const Product = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [alert, setAlert] = useState('');
    const [loading, setLoading] = useState(true);
    const [openLoginDialog, setOpenLoginDialog] = useState(false);
    const [isEnquiring, setIsEnquiring] = useState(false); // Added state for enquiry feedback
    
    const apiUrl = import.meta.env.VITE_APP_API_URL;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const id = localStorage.getItem('id');
                const productsResponse = await axios.get(`${apiUrl}/products/`, {
                    headers: {
                        'Authorization': `Bearer ${id}`
                    },
                    withCredentials: true
                });
                setProducts(productsResponse.data);

                // Extract unique categories from product data
                const uniqueCategories = [...new Set(productsResponse.data.map(product => product.category))];
                setCategories(uniqueCategories.map(category => ({ value: category, label: category })));
            } catch (err) {
                console.error('Error fetching data:', err);
                setAlert('Failed to fetch data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [apiUrl]);

    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => setAlert(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    const checkIfLoggedIn = async () => {
        try {
            // Make the API call and wait for the response
            const response = await axios.get(`${apiUrl}/login/success`, { withCredentials: true });
    
            // Check if the response contains the expected user data
            if (response.data && response.data.userId) {
                return true;  // User is logged in
            } else {
                return false; // No user data, so not logged in
            }
        } catch (error) {
            console.error('Error checking login status:', error);
            return false;  // Return false if there's an error with the request
        }
    };
    

    const handleMoreInfo = (id) => {
        if (checkIfLoggedIn()) {
            navigate(`/products/${id}`);
        } else {
            setOpenLoginDialog(true); // Open login dialog if not logged in
        }
    };

    const handleEnquiry = async (product) => {
        if (checkIfLoggedIn()) {
            setIsEnquiring(true);
            try {
                const { productName, category, description, productImgUrls, _id } = product;
                const productUrl = `${window.location.origin}/products/${_id}`;

                const imageUrl = productImgUrls[0]; // First image URL

                const whatsappMessage = `Hello! 🌟\n\n` +
                    `I'm interested in learning more about the following product:\n\n` +
                    `*Product Name:* ${productName}\n` +
                    `*Category:* ${category}\n` +
                    `*Description:* ${description}\n` +
                    `*Product Link:* ${productUrl}\n` + // Product detail link
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
        } else {
            setOpenLoginDialog(true); // Open login dialog if not logged in
        }
    };

    const handleLoginDialogClose = () => {
        setOpenLoginDialog(false);
    };
    const handleLoginRedirect = () => {
        navigate('/login'); // Redirect to login page
        setOpenLoginDialog(false); // Close the dialog
    };

    const handleSearchChange = (inputValue) => {
        setSearchTerm(inputValue);
    };

    const handleCategoryChange = (selectedOption) => {
        setSelectedCategory(selectedOption);
    };

    const filteredProducts = products.filter(product => {
        const matchesSearchTerm = product.productName.toLowerCase().includes(searchTerm.toLowerCase()) || product.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? product.category === selectedCategory.value : true;
        return matchesSearchTerm && matchesCategory;
    });

    const stockStatus = (stock) => {
        if (stock === 0) {
            return { message: 'No stock available', className: 'text-red-600' }; // Red color for no stock
        } else if (stock < 10) {
            return { message: 'Limited stock', className: 'text-yellow-600' }; // Yellow color for limited stock
        } else {
            return { message: 'In stock', className: 'text-green-600' }; // Green color for available stock
        }
    };

    const Carousel = ({ images = [] }) => {
        const [currentIndex, setCurrentIndex] = useState(0);
        const carouselRef = useRef(null);

        const handleCarouselChange = (direction) => {
            const totalImages = images.length;
            const newIndex = (currentIndex + direction + totalImages) % totalImages;
            setCurrentIndex(newIndex);
        };

        useEffect(() => {
            const interval = setInterval(() => {
                handleCarouselChange(1);
            }, 5000); // Change image every 5 seconds

            return () => clearInterval(interval);
        }, [currentIndex]);

        useEffect(() => {
            if (carouselRef.current) {
                carouselRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
            }
        }, [currentIndex]);

        if (images.length === 0) {
            return <div>No images available</div>;
        }

        return (
            <div className="relative overflow-hidden rounded-lg shadow-lg bg-gray-200">
                <div className="flex transition-transform duration-700 ease-in-out" ref={carouselRef}>
                    {images.map((img, index) => (
                        <div key={index} className="min-w-full">
                          <CardMedia
    component="img"
    image={img || 'default-image-url'} // Fallback to a default image if `img` is undefined
    alt={`Product Image ${index}`}
    sx={{
        width: '100%', // Ensures the image fits the width of the card
        height: 200, // Fixed height for uniformity
        objectFit: 'contain', // Ensures the entire image is visible within the given space
        borderRadius: '8px', // Applies rounded corners to all edges
        backgroundColor: '#f5f5f5', // Optional: Adds a background to handle transparent images
    }}
/>

                        </div>
                    ))}
                </div>
                <button
                    className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-lg transition-opacity opacity-75 hover:opacity-100"
                    onClick={() => handleCarouselChange(-1)}
                >
                    &lt;
                </button>
                <button
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-lg transition-opacity opacity-75 hover:opacity-100"
                    onClick={() => handleCarouselChange(1)}
                >
                    &gt;
                </button>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar option="products" />
            <div className="container mx-auto py-8 px-4">
                {alert && (
                    <Alert severity="error" className="fixed top-4 left-1/2 transform -translate-x-1/2 w-full max-w-lg z-50">
                        <AlertTitle className="font-bold text-lg">Error</AlertTitle>
                        {alert}
                    </Alert>
                )}

                {loading ? (
                    <div className="flex justify-center items-center min-h-screen">
                        <CircularProgress />
                    </div>
                ) : (
                    <>
                        <SearchFilter
                            categories={categories}
                            onSearchChange={handleSearchChange}
                            onCategoryChange={handleCategoryChange}
                        />


<Dialog open={openLoginDialog} onClose={handleLoginDialogClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ fontWeight: 600, textAlign: 'center', color: '#333' }}>Please log in first</DialogTitle>
            <DialogContent sx={{ paddingTop: '20px' }}>
                <Typography variant="body1" sx={{ marginBottom: '20px', color: '#555' }}>
                    You need to be logged in to view more information or make inquiries. Would you like to log in now?
                </Typography>
            </DialogContent>
            <DialogActions sx={{ padding: '20px' }}>
                <Button
                    onClick={handleLoginDialogClose}
                    color="secondary"
                    variant="outlined"
                    sx={{
                        padding: '10px 20px',
                        fontWeight: '600',
                        '&:hover': {
                            backgroundColor: '#f4f4f4',
                        },
                    }}
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleLoginRedirect}
                    color="primary"
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                    sx={{
                        padding: '10px 20px',
                        fontWeight: '600',
                        backgroundColor: '#3f51b5',
                        '&:hover': {
                            backgroundColor: '#303f9f',
                        },
                    }}
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Log In'}
                </Button>
            </DialogActions>
        </Dialog>
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map(product => {
                                    const stockInfo = stockStatus(product.stock);
                                    return (
                                        <Card key={product._id} className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden">
                                            <Carousel images={product.productImgUrls} />
                                            <CardContent>
                                                <Typography variant="h6" className="text-gray-800 font-semibold truncate">
                                                    {product.productName}
                                                </Typography>
                                                <div className="mt-2 space-y-2">
                                                    <Typography variant="body1" className="text-gray-600">
                                                        Category: {product.category}
                                                    </Typography>
                                
                                                    <Typography variant="body1" className={`font-semibold ${stockInfo.className}`}>
                                                        {stockInfo.message}
                                                    </Typography>
                                                </div>
                                                <div className="flex justify-between items-center mt-4">
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => handleMoreInfo(product._id)}
                                                        sx={{
                                                            padding: { xs: '8px 12px', sm: '10px 16px' },  // Smaller padding for extra-small screens
                                                        }}
                                                    >
                                                        More Info
                                                    </Button>
                                                    <Button
                                                            variant="outlined"
                                                            color="primary"
                                                            onClick={() => handleEnquiry(product)}
                                                            disabled={isEnquiring}
                                                            startIcon={<WhatsAppIcon />} // Add the WhatsApp icon here
                                                        >
                                                            {isEnquiring ? 'Enquiring...' : 'Enquire'}
                                                        </Button>
                                                </div>
                                            </CardContent>
                                        </Card>

                                    );
                                })
                            ) : (
                                <Typography variant="h6" className="text-gray-600 text-center col-span-full">
                                    No products found.
                                </Typography>
                            )}
                        </div>
                    </>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Product;
