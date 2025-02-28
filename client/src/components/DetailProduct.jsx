import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, Typography, Button, Grid, Chip, Divider, Box, Rating, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Tilt } from 'react-tilt';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navbar from './Navbar.jsx';
import Footer from './footer.jsx';
import LoadingSpinner from '../components/Loading';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedIcon from '@mui/icons-material/Verified';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { Fullscreen, FullscreenExit } from '@mui/icons-material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [isEnquiring, setIsEnquiring] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [fullscreen, setFullscreen] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const apiUrl = "https://e-commerce-capstone.onrender.com";
    
    const [headerRef, headerInView] = useInView({
        threshold: 0.1,
    });

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: false,
            mirror: true,
        });
        
        // Scroll to top when component mounts
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const fetchProductAndAllProducts = async () => {
            try {
                const response = await axios.get(`${apiUrl}/products/${id}`, { withCredentials: true });
                setProduct(response.data);

                const allProductsResponse = await axios.get(`${apiUrl}/products`, { withCredentials: true });
                const filteredRelatedProducts = allProductsResponse.data.filter(product => 
                    product.category === response.data.category && product._id !== response.data._id
                ).slice(0, 8);
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

    if (loading) return <LoadingSpinner />;
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

    const toggleFullscreen = () => {
        setFullscreen(!fullscreen);
    };

    const incrementQuantity = () => {
        setQuantity(prev => prev + 1);
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    // Function to determine stock status based on actual stock quantity
    const getStockStatus = (stockQuantity) => {
        if (stockQuantity <= 0) {
            return { status: 'Out of Stock', color: 'error' };
        } else if (stockQuantity < 5) {
            return { status: 'Limited Stock', color: 'warning' };
        } else {
            return { status: 'In Stock', color: 'success' };
        }
    };

    // Random rating for demo purposes
    const rating = 4.5;
    const reviewCount = 24;
    
    // Get actual stock status based on product stock
    const stockStatus = product.stock !== undefined ? 
        getStockStatus(product.stock) : 
        { status: 'Checking Stock...', color: 'info' };

    const handleNextImage = () => {
        setActiveImageIndex((prev) => 
            prev === product.productImgUrls.length - 1 ? 0 : prev + 1
        );
    };

    const handlePrevImage = () => {
        setActiveImageIndex((prev) => 
            prev === 0 ? product.productImgUrls.length - 1 : prev - 1
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <div className="mt-20">
                {/* Breadcrumb Navigation */}
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                        <Link to="/" className="hover:text-blue-600">
                            Home
                        </Link>
                        <ArrowForwardIosIcon sx={{ fontSize: 12 }} />
                        <Link to="/products" className="hover:text-blue-600">
                            Products
                        </Link>
                        <ArrowForwardIosIcon sx={{ fontSize: 12 }} />
                        <span className="text-gray-400">{product?.productName}</span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-4 py-8">
                    <Grid container spacing={6}>
                        {/* Left Column - Product Images */}
                        <Grid item xs={12} md={7}>
                            <motion.div className="sticky top-24">
                                <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-white group">
                                    {/* Navigation Arrows - Made more prominent */}
                                    <button 
                                        onClick={handlePrevImage}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 z-10 transition-all duration-200 opacity-0 group-hover:opacity-100"
                                    >
                                        <ArrowBackIosIcon />
                                    </button>
                                    <button 
                                        onClick={handleNextImage}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 z-10 transition-all duration-200 opacity-0 group-hover:opacity-100"
                                    >
                                        <ArrowForwardIosIcon />
                                    </button>

                                    {/* Main Image */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="relative"
                                    >
                                        <img
                                            src={product.productImgUrls[activeImageIndex]}
                                            alt={product.productName}
                                            className="w-full h-[400px] object-contain p-4"
                                        />
                                    </motion.div>

                                    {/* Image Counter */}
                                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium">
                                        {activeImageIndex + 1} / {product.productImgUrls.length}
                                    </div>
                                </div>
                            </motion.div>
                        </Grid>

                        {/* Right Column - Product Details */}
                        <Grid item xs={12} md={5}>
                            <div className="space-y-8 bg-white p-8 rounded-2xl shadow-lg">
                                {/* Category and Stock Status */}
                                <div className="flex items-center space-x-3">
                                    <Chip 
                                        label={product.category} 
                                        color="primary" 
                                        size="small"
                                        className="bg-blue-100 text-blue-800"
                                    />
                                    <Chip 
                                        label={stockStatus.status} 
                                        color={stockStatus.color} 
                                        size="small"
                                        variant="outlined"
                                        icon={stockStatus.color === 'success' ? <CheckCircleIcon fontSize="small" /> : null}
                                    />
                                </div>

                                {/* Product Title */}
                                <Typography variant="h3" className="font-bold text-gray-800">
                                    {product.productName}
                                </Typography>

                                {/* Rating and Actions */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Rating 
                                            value={rating} 
                                            precision={0.5} 
                                            readOnly 
                                            size="large"
                                        />
                                        <Typography variant="body1" className="ml-2 text-gray-600">
                                            ({reviewCount})
                                        </Typography>
                                    </div>
                                    <div className="flex space-x-2">
                                        <IconButton className="bg-gray-50 hover:bg-gray-100">
                                            <FavoriteIcon />
                                        </IconButton>
                                        <IconButton className="bg-gray-50 hover:bg-gray-100">
                                            <ShareIcon />
                                        </IconButton>
                                    </div>
                                </div>

                                <Divider />

                                {/* Key Features */}
                                <div className="grid grid-cols-1 gap-4">
                                    {[
                                        { icon: <LocalShippingIcon />, text: "Fast & Secure Shipping", subtext: "2-3 business days" },
                                        { icon: <VerifiedIcon />, text: "Genuine Product", subtext: "100% authentic guarantee" },
                                        { icon: <SupportAgentIcon />, text: "24/7 Support", subtext: "Always here to help" }
                                    ].map((feature, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 + index * 0.1 }}
                                            className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50"
                                        >
                                            <div className="text-blue-600">
                                                {feature.icon}
                                            </div>
                                            <div>
                                                <Typography className="font-semibold">
                                                    {feature.text}
                                                </Typography>
                                                <Typography variant="body2" className="text-gray-500">
                                                    {feature.subtext}
                                                </Typography>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* CTA Button */}
                                <motion.div
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="pt-4"
                                >
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        onClick={() => handleEnquiry(product)}
                                        disabled={isEnquiring}
                                        startIcon={<WhatsAppIcon />}
                                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                                        sx={{
                                            py: 2,
                                            borderRadius: '12px',
                                            textTransform: 'none',
                                            fontSize: '1.1rem',
                                        }}
                                    >
                                        {isEnquiring ? 'Sending...' : 'Enquire Now via WhatsApp'}
                                    </Button>
                                </motion.div>
                            </div>
                        </Grid>
                    </Grid>

                    {/* Related Products with adjusted spacing */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-16" data-aos="fade-up">
                            <Typography
                                variant="h4"
                                className="text-center mb-12 font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                            >
                                You May Also Like
                            </Typography>
                            <Swiper
                                slidesPerView={1}
                                spaceBetween={20}
                                pagination={{
                                    clickable: true,
                                    dynamicBullets: true,
                                }}
                                breakpoints={{
                                    640: {
                                        slidesPerView: 2,
                                    },
                                    1024: {
                                        slidesPerView: 3,
                                    },
                                    1280: {
                                        slidesPerView: 4,
                                    },
                                }}
                                modules={[Pagination, Navigation]}
                                className="related-products-swiper"
                            >
                                {relatedProducts.map((relatedProduct) => (
                                    <SwiperSlide key={relatedProduct._id}>
                                        <Link to={`/products/${relatedProduct._id}`}>
                                            <motion.div
                                                whileHover={{ y: -10 }}
                                                className="cursor-pointer"
                                            >
                                                <Card className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 h-full">
                                                    <div className="relative">
                                                        <img
                                                            src={relatedProduct.productImgUrls[0]}
                                                            alt={relatedProduct.productName}
                                                            className="w-full h-64 object-cover transform transition-transform duration-300 hover:scale-110"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                                                            <div className="absolute bottom-4 left-4 right-4">
                                                                <Typography variant="h6" className="text-white font-bold truncate">
                                                                    {relatedProduct.productName}
                                                                </Typography>
                                                                <Typography variant="body2" className="text-gray-200">
                                                                    {relatedProduct.category}
                                                                </Typography>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <CardContent>
                                                        <Typography variant="h6" className="font-semibold truncate">
                                                            {relatedProduct.productName}
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary" className="mb-3">
                                                            {relatedProduct.category}
                                                        </Typography>
                                                        <Button 
                                                            variant="outlined" 
                                                            fullWidth
                                                            size="small"
                                                            className="rounded-lg"
                                                        >
                                                            View Details
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        </Link>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProductDetail;
