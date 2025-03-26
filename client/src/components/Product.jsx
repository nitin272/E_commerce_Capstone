import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Alert, AlertTitle, CircularProgress, Typography, Card, CardContent, CardMedia,Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Navbar from './Navbar';
import Footer from './footer.jsx';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import axios from 'axios';
import SearchFilter from './Search'; 
import { Login } from '@mui/icons-material';
import { Login as LoginIcon } from '@mui/icons-material'; 
import Loading from '../components/Loading';
import Lottie from 'lottie-react';
import emptyAnimation from '../assets/animations/empty.json';
import SearchIcon from '@mui/icons-material/Search';


const Product = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [alert, setAlert] = useState('');
    const [loading, setLoading] = useState(true);
    const [openLoginDialog, setOpenLoginDialog] = useState(false);
    const [isEnquiring, setIsEnquiring] = useState(false);
    
    const apiUrl = "https://e-commerce-capstone.onrender.com";
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

            const response = await axios.get(`${apiUrl}/login/success`, { withCredentials: true });
            if (response.data && response.data.userId) {
                return true;  
            } else {
                return false; 
            }
        } catch (error) {
            console.error('Error checking login status:', error);
            return false; 
        }
    };
    

    const handleMoreInfo = (id) => {
        if (checkIfLoggedIn()) {
            navigate(`/products/${id}`);
        } else {
            setOpenLoginDialog(true); 
        }
    };

    const handleEnquiry = async (product) => {
        if (checkIfLoggedIn()) {
            setIsEnquiring(true);
            try {
                const { productName, category, description, productImgUrls, _id } = product;
                const productUrl = `${window.location.origin}/products/${_id}`;

                const imageUrl = productImgUrls[0];

                const whatsappMessage = `Hello! 🌟\n\n` +
                    `I'm interested in learning more about the following product:\n\n` +
                    `*Product Name:* ${productName}\n` +
                    `*Category:* ${category}\n` +
                    `*Description:* ${description}\n` +
                    `*Product Link:* ${productUrl}\n` + 
                    `*Image:* ${imageUrl}\n\n` +
                    `Could you please provide more details? Thank you! 🙏`;

                const encodedMessage = encodeURIComponent(whatsappMessage);
                const whatsappUrl = `https://wa.me/${9509290112}?text=${encodedMessage}`;
                window.open(whatsappUrl, '_blank');
            } catch (error) {
                console.error('Error opening WhatsApp:', error);
            } finally {
                setIsEnquiring(false);
            }
        } else {
            setOpenLoginDialog(true); 
        }
    };

    const handleLoginDialogClose = () => {
        setOpenLoginDialog(false);
    };
    const handleLoginRedirect = () => {
        navigate('/login'); 
        setOpenLoginDialog(false); 
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
            return { message: 'No stock available', className: 'text-red-600' }; 
        } else if (stock < 10) {
            return { message: 'Limited stock', className: 'text-yellow-600' };
        } else {
            return { message: 'In stock', className: 'text-green-600' }; 
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
            }, 5000);

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
            <div className="relative overflow-hidden rounded-t-xl">
                <div className="flex transition-transform duration-700 ease-in-out" ref={carouselRef}>
                    {images.map((img, index) => (
                        <div key={index} className="min-w-full">
                            <CardMedia
                                component="img"
                                image={img || 'default-image-url'}
                                alt={`Product Image ${index}`}
                                sx={{
                                    width: '100%',
                                    height: 280,
                                    objectFit: 'cover',
                                    transition: 'transform 0.3s ease-in-out',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                    },
                                }}
                            />
                        </div>
                    ))}
                </div>
                <button
                    className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/80 text-gray-800 p-3 rounded-full shadow-lg transition-all hover:bg-white hover:scale-110"
                    onClick={() => handleCarouselChange(-1)}
                >
                    ←
                </button>
                <button
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/80 text-gray-800 p-3 rounded-full shadow-lg transition-all hover:bg-white hover:scale-110"
                    onClick={() => handleCarouselChange(1)}
                >
                    →
                </button>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Navbar option="products" />
            
            {/* Search Section with Hero */}
            <div className="bg-white border-b">
                <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 py-20">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="relative z-10">
                        <SearchFilter
                            categories={categories}
                            onSearchChange={handleSearchChange}
                            onCategoryChange={handleCategoryChange}
                        />
                    </div>
                </div>
            </div>

            {/* Products Grid Section */}
            <div className="container mx-auto py-12 px-4 max-w-7xl">
                {alert && (
                    <Alert 
                        severity="error" 
                        className="fixed top-4 left-1/2 transform -translate-x-1/2 w-full max-w-lg z-50"
                        sx={{ 
                            backgroundColor: '#fff',
                            border: '1px solid #ef4444',
                            borderRadius: '10px',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                    >
                        <AlertTitle className="font-bold text-lg">Error</AlertTitle>
                        {alert}
                    </Alert>
                )}

                {loading ? (
                    <Loading />
                ) : (
                    <>
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {filteredProducts.map(product => {
                                    const stockInfo = stockStatus(product.stock);
                                    return (
                                        <Card 
                                            key={product._id} 
                                            className="bg-white rounded-xl overflow-hidden group"
                                            sx={{
                                                transition: 'all 0.3s ease-in-out',
                                                '&:hover': {
                                                    transform: 'translateY(-8px)',
                                                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                                                },
                                            }}
                                        >
                                            <div className="relative">
                                                <Carousel images={product.productImgUrls} />
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                                            </div>
                                            <CardContent className="p-6">
                                                <Typography 
                                                    variant="h6" 
                                                    className="text-gray-800 font-bold mb-3 text-xl line-clamp-2"
                                                >
                                                    {product.productName}
                                                </Typography>
                                                <div className="space-y-3">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-gray-500">Category:</span>
                                                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                                                            {product.category}
                                                        </span>
                                                    </div>
                                                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                        stockInfo.className === 'text-red-600' ? 'bg-red-50' :
                                                        stockInfo.className === 'text-yellow-600' ? 'bg-yellow-50' : 'bg-green-50'
                                                    }`}>
                                                        <span className={`w-2 h-2 rounded-full mr-2 ${
                                                            stockInfo.className === 'text-red-600' ? 'bg-red-500' :
                                                            stockInfo.className === 'text-yellow-600' ? 'bg-yellow-500' : 'bg-green-500'
                                                        }`}></span>
                                                        {stockInfo.message}
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center mt-6 gap-4">
                                                    <Button
                                                        variant="contained"
                                                        onClick={() => handleMoreInfo(product._id)}
                                                        className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                                                        sx={{
                                                            flex: 1,
                                                            borderRadius: '8px',
                                                            textTransform: 'none',
                                                            fontSize: '0.95rem',
                                                            padding: '10px',
                                                        }}
                                                    >
                                                        More Info
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        onClick={() => handleEnquiry(product)}
                                                        disabled={isEnquiring}
                                                        startIcon={<WhatsAppIcon />}
                                                        className="border-green-500 text-green-500 hover:bg-green-50"
                                                        sx={{
                                                            flex: 1,
                                                            borderRadius: '8px',
                                                            textTransform: 'none',
                                                            fontSize: '0.95rem',
                                                            padding: '10px',
                                                        }}
                                                    >
                                                        {isEnquiring ? 'Enquiring...' : 'Enquire'}
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16">
                                <div className="w-64 h-64 mb-8">
                                    <Lottie 
                                        animationData={emptyAnimation} 
                                        loop={true}
                                        className="w-full h-full"
                                    />
                                </div>
                                <Typography variant="h5" className="text-gray-600 font-medium mb-4 text-center">
                                    No products found
                                </Typography>
                                <Typography variant="body1" className="text-gray-500 text-center max-w-md">
                                    We couldn't find any products matching your criteria. Try adjusting your search or filters.
                                </Typography>
                                <Button
                                    variant="outlined"
                                    startIcon={<SearchIcon />}
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedCategory(null);
                                    }}
                                    className="mt-6 border-blue-500 text-blue-500 hover:bg-blue-50"
                                    sx={{
                                        borderRadius: '8px',
                                        textTransform: 'none',
                                        fontSize: '0.95rem',
                                        padding: '10px 20px',
                                    }}
                                >
                                    Clear Search
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
            
            {/* Login Dialog */}
            <Dialog
                open={openLoginDialog}
                onClose={handleLoginDialogClose}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    className: "rounded-lg p-4"
                }}
            >
                <DialogTitle className="text-center font-bold text-gray-800">
                    Login Required
                </DialogTitle>
                <DialogContent className="text-center py-4">
                    <Typography variant="body1" className="text-gray-600">
                        Please login to continue viewing product details.
                    </Typography>
                </DialogContent>
                <DialogActions className="justify-center pb-4">
                    <Button
                        onClick={handleLoginRedirect}
                        variant="contained"
                        className="bg-blue-600 hover:bg-blue-700"
                        sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontSize: '0.95rem',
                            padding: '10px 24px',
                        }}
                    >
                        Login
                    </Button>
                    <Button
                        onClick={handleLoginDialogClose}
                        variant="outlined"
                        className="border-gray-300 text-gray-600"
                        sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontSize: '0.95rem',
                            padding: '10px 24px',
                        }}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            
            <Footer />
        </div>
    );
};

export default Product;
