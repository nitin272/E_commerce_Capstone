import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Alert, AlertTitle, CircularProgress, Typography, Card, CardContent, CardMedia } from '@mui/material';
import Navbar from './Navbar';
import Footer from './footer.jsx';
import axios from 'axios';
import SearchFilter from './Search'; // Import the SearchFilter component

const Product = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [alert, setAlert] = useState('');
    const [loading, setLoading] = useState(true);
    const [isEnquiring, setIsEnquiring] = useState(false); // Added state for enquiry feedback
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

    const handleMoreInfo = (id) => {
        navigate(`/products/${id}`);
    };

    const handleEnquiry = async (product) => {
        setIsEnquiring(true);
        try {
            const { productName, category, description, productImgUrls, _id } = product;
            const productUrl = `${window.location.origin}/products/${_id}`; 

            const imageUrl = productImgUrls[0]; // First image URL
    
            // Improved WhatsApp message
            const whatsappMessage = `Hello! 🌟\n\n` +
                `I'm interested in learning more about the following product:\n\n` +
                `*Product Name:* ${productName}\n` +
                `*Category:* ${category}\n` +
                `*Description:* ${description.slice(0, 100)}...\n\n` + // Limiting description to 100 characters
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
                                height="250" // Adjust the height for larger images
                                image={img}
                                alt={`Product Image ${index}`}
                                sx={{ borderRadius: '8px', objectFit: 'cover' }}
                            />
                        </div>
                    ))}
                </div>
                <button
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-lg transition-opacity opacity-75 hover:opacity-100"
                    onClick={() => handleCarouselChange(-1)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-lg transition-opacity opacity-75 hover:opacity-100"
                    onClick={() => handleCarouselChange(1)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100">
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

<div className="mt-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-center">
        {filteredProducts.length > 0 ? (
            filteredProducts.map(product => {
                const stockInfo = stockStatus(product.stock);
                return (
                    <Card key={product._id} sx={{ maxWidth: 360, boxShadow: 6, borderRadius: 4 , marginLeft:'3vh' }} className="bg-white hover:shadow-xl transition-shadow">
                        <Carousel images={product.productImgUrls} />
                        <CardContent>
                            <Typography variant="h6" gutterBottom className="truncate text-gray-800 font-semibold">
                                {product.productName}
                            </Typography>
                            <div className="flex flex-col gap-2 mt-2">
                                <Typography variant="body1" className="text-xl font-bold text-gray-700">
                                    Category: <span className="font-normal text-gray-800">{product.category}</span>
                                </Typography>
                                <Typography variant="body1" className="text-xl font-bold text-gray-700">
                                    Price: <span className="font-normal text-gray-800">₹{product.price}</span>
                                </Typography>
                                <Typography variant="body1" className={`text-xl font-bold ${stockInfo.className}`}>
                                <span className="font-normal">{stockInfo.message}</span>
                                </Typography>
                                {/* <Typography variant="body2" className="text-gray-600">
                                    {product.description.length > 100 ? `${product.description.slice(0, 100)}...` : product.description}
                                </Typography> */}
                            </div>
                            <div className="flex justify-between mt-4">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleMoreInfo(product._id)}
                                >
                                    More Info
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => handleEnquiry(product)}
                                    disabled={isEnquiring}
                                >
                                    {isEnquiring ? <CircularProgress size={24} /> : 'Enquire'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                );
            })
        ) : (
            <Typography variant="body1" className="text-gray-600">
                No products available.
            </Typography>
        )}
    </div>
</div>

                    </>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Product;
