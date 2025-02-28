import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './footer.jsx';
import { Typewriter } from 'react-simple-typewriter';
import axios from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, CircularProgress } from '@mui/material';
import { Login, ShoppingCart, Category, Star } from '@mui/icons-material';
import Logo from '../assets/supermarket.jpg';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCards, EffectFade, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useInView } from 'react-intersection-observer';
import { Tilt } from 'react-tilt';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Lottie from 'lottie-react';
import shoppingAnimation from '../assets/animations/shopping.json';
import loadingAnimation from '../assets/animations/loading.json';
import emptyAnimation from '../assets/animations/empty.json';

const Home = () => {
  const [userName, setUserName] = useState('Guest');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [dialogOpen, setDialogOpen] = useState(false); 
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAll, setShowAll] = useState(false);

  
  const apiUrl = "https://e-commerce-capstone.onrender.com";

  const bgImages = [
    {
      content: 'Shop Precision, Shop Scalemart',
      line: 'Your one-stop destination for reliable and quality products.',
    }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${apiUrl}/products`); 
        const products = response.data;
        setProducts(products);
        setFilteredProducts(products); 
        const uniqueCategories = ['All', ...new Set(products.map((product) => product.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchUserName = async () => {
      try {
        const user = await axios.get(`${apiUrl}/login/success`, { withCredentials: true }); 
        setUserName(user.data.user.name);
        setIsLoggedIn(true); 
      } catch (error) {
        console.error('Error fetching user:', error);
        setIsLoggedIn(false); 
      }
    };

    fetchUserName();
    fetchProducts();
  }, []);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const defaultTiltOptions = {
    reverse: false,
    max: 15,
    perspective: 1000,
    scale: 1.05,
    speed: 1000,
    transition: true,
    axis: null,
    reset: true,
    easing: "cubic-bezier(.03,.98,.52,.99)",
  };

 const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) => product.category === category);
      setFilteredProducts(filtered);
    }
  };

  const handleLogin = () => {
    window.location.href = 'http://localhost:4500/login';
  };

  const handleProductClick = (product) => {
    if (isLoggedIn) {
      window.location.href = `http://localhost:4500/products/${product._id}`;
    } else {
      setDialogOpen(true); 
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false); 
  };
  const displayedCategories = showAll ? categories : categories.slice(0, 6);

  const handleShowMoreToggle = () => {
    setShowAll(!showAll);
  };

  // Add animation options
  const defaultOptions = {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  return (
    <div className="overflow-hidden" style={{ marginTop: '12vh' }}>
      <Navbar option="" />

      {/* Updated Welcome Section without Logo */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative min-h-[80vh] bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20">
          <Lottie 
            animationData={shoppingAnimation}
            options={defaultOptions}
            className="w-full h-full"
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[80vh]">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Welcome Back, {userName}! 🎉
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              Discover amazing deals curated just for you
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
              onClick={() => handleCategoryClick('All')}
            >
              Start Shopping
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Featured Products Carousel */}
      <div className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Featured Products
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"/>
          </motion.div>
          
          <Swiper
            effect="cards"
            grabCursor={true}
            modules={[EffectCards, Autoplay]}
            className="w-full md:w-3/4 lg:w-1/2 mx-auto"
            autoplay={{ delay: 3000 }}
          >
            {products.slice(0, 5).map((product) => (
              <SwiperSlide key={product._id}>
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <img
                    src={product.productImgUrls[0]}
                    alt={product.productName}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2">{product.productName}</h3>
                    <p className="text-gray-600 mb-4">{product.category}</p>
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleProductClick(product)}
                        className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Enhanced Categories Section */}
      <div className="bg-white py-16" data-aos="fade-up">
        <div className="w-full md:w-4/5 lg:w-3/5 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-semibold text-gray-800 mb-3">
              Explore Our Categories
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"/>
          </motion.div>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-4 pb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {displayedCategories.map((category, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                whileTap={{ scale: 0.95 }}
                className={`py-3 px-8 font-medium rounded-full transition duration-300 ${
                  selectedCategory === category 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-800 border-2 border-gray-200 hover:border-blue-400'
                }`}
                onClick={() => handleCategoryClick(category)}
              >
                <Category className="mr-2" sx={{ fontSize: 20 }} />
                {category}
              </motion.button>
            ))}
          </motion.div>
          
          {categories.length > 6 && (
            <motion.div 
              className="text-center mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                onClick={handleShowMoreToggle}
                variant="outlined"
                color="primary"
                className="hover:bg-blue-50"
                endIcon={showAll ? <Star /> : <Category />}
              >
                {showAll ? 'Show Less Categories' : 'Explore More Categories'}
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Enhanced Loading State with Custom Animation */}
      {loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl"
          >
            <Lottie 
              animationData={loadingAnimation}
              options={defaultOptions}
              className="w-64 h-64 mx-auto"
            />
            <p className="text-center text-lg font-medium text-gray-700 mt-4">
              Loading amazing products...
            </p>
          </motion.div>
        </motion.div>
      )}

      {/* Enhanced Empty State with Animation */}
      {!loading && filteredProducts.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 bg-gray-50"
        >
          <div className="w-72 h-72">
            <Lottie 
              animationData={emptyAnimation}
              options={defaultOptions}
            />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mt-6">No Products Found</h3>
          <p className="text-gray-600 mt-2 mb-6">Try selecting a different category</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCategoryClick('All')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            View All Products
          </motion.button>
        </motion.div>
      )}

      {/* Enhanced Products Grid with Glass Effect */}
      {!loading && filteredProducts.length > 0 && (
        <div className="bg-gradient-to-b from-gray-50 to-white py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {selectedCategory === 'All' ? 'Featured Products' : `${selectedCategory} Collection`}
                </span>
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mx-auto rounded-full"/>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-2">
                    <div className="aspect-w-1 aspect-h-1 w-full">
                      <img
                        src={product.productImgUrls[0]}
                        alt={product.productName}
                        className="w-full h-full object-cover object-center transform transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                        {product.productName}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">{product.category}</p>
                      <div className="flex justify-end">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleProductClick(product)}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                        >
                          View Details
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog} 
        fullWidth 
        maxWidth="sm"
        PaperProps={{
          className: "rounded-xl"
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 700, 
          textAlign: 'center', 
          color: '#333',
          background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
          py: 3
        }}>
          Login Required
        </DialogTitle>
        <DialogContent sx={{ paddingTop: '24px', paddingBottom: '24px' }}>
          <Typography variant="body1" sx={{ color: '#555', textAlign: 'center' }}>
            To explore more details and make purchases, please log in to your account.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button
            onClick={handleCloseDialog}
            color="secondary"
            variant="outlined"
            sx={{
              padding: '10px 20px',
              fontWeight: '600',
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: '#f4f4f4',
              },
            }}
            disabled={loading}
          >
            Maybe Later
          </Button>
          <Button
            onClick={handleLogin}
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Login />}
            sx={{
              padding: '10px 20px',
              fontWeight: '600',
              borderRadius: '8px',
              background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
              '&:hover': {
                background: 'linear-gradient(to right, #2563eb, #7c3aed)',
              },
            }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log In Now'}
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Home;
