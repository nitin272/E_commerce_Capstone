import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './footer.jsx';
import { Typewriter } from 'react-simple-typewriter';
import axios from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { Login } from '@mui/icons-material';
import { Login as LoginIcon } from '@mui/icons-material'; 
import Logo from '../assets/supermarket.jpg';

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

  const apiUrl = 'https://e-commerce-capstone.onrender.com';

  const bgImages = [
    {
      img: Logo,
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
    window.location.href = 'https://scale-mart1.vercel.app/login';
  };

  const handleProductClick = (product) => {
    if (isLoggedIn) {
      window.location.href = `${apiUrl}/products/${product._id}`;
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
  return (
    <div className="overflow-hidden" style={{ marginTop: '12vh' }}>
      <Navbar option="" />


      <div className="bg-gray-100 py-4 text-center">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-blue-600">
          Hi {userName}, Welcome Back!
        </h1>
      </div>

     <div
        style={{
          backgroundImage: `url(${bgImages[0].img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'background-image 1s ease-in-out',
        }}
        className="relative bg-no-repeat bg-center h-[40vh] md:h-[60vh] lg:h-[70vh]"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/80"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-4 md:p-8 lg:p-12 rounded-lg">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-serif font-bold mb-2 md:mb-4">
              <Typewriter
                words={[bgImages[0].content]}
                cursor
                cursorStyle="|"
                typeSpeed={65}
                deleteSpeed={40}
                delaySpeed={500}
                loop
              />
            </h1>
            <p className="text-sm md:text-lg lg:text-xl font-serif font-semibold leading-relaxed">
              {bgImages[0].line}
            </p>
          </div>
        </div>
      </div>


      <div className="bg-white py-12">
        <div className="w-full md:w-4/5 lg:w-3/5 mx-auto">
          <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
            Explore Our Categories
          </h2>
          <p className="text-lg text-gray-600 text-center mb-6 px-4 sm:px-0">
            Find the right product for your needs from our wide selection of categories.
          </p>


       <div className="pb-4">
      <div className="flex flex-wrap justify-start gap-4">
        {displayedCategories.map((category, index) => (
          <button
            key={index}
            className={`py-2 px-6 font-medium rounded-lg transition duration-200 ${
              selectedCategory === category ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
            }`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {categories.length > 6 && (
        <div className="mt-4">
          <button
            className="py-2 px-4 font-medium text-blue-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200"
            onClick={handleShowMoreToggle}
          >
            {showAll ? 'Show Less' : 'Show More'}
          </button>
        </div>
      )}
    </div>  
        </div>
      </div>


      {!isLoggedIn && (
        <div className="text-center mt-10">
          <button
            onClick={handleLogin}
            className="py-3 px-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
          >
            Log In to Start Shopping
          </button>
        </div>
      )}

      

      <div className="w-full md:w-11/12 lg:w-10/12 mx-auto py-8 px-4 bg-gray-50 bg-[black],">
        <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900 text-center mb-10">
          {selectedCategory === 'All' ? 'Featured Products' : `Products in ${selectedCategory}`}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white shadow-lg rounded-xl hover:shadow-2xl transition-shadow relative overflow-hidden"
            >
              <div className="w-full h-52 overflow-hidden rounded-t-xl">
                <img
                  src={product.productImgUrls[0] || 'default-image-url'}
                  alt={product.productName}
                  style={{
                    width: '100%',
                    height: 200,
                    objectFit: 'contain',
                    backgroundColor: '#f5f5f5',
                    transition: 'transform 0.3s',
                  }}
                  onMouseEnter={(e) => (e.target.style.transform = 'scale(1.1)')}
                  onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">
                  {product.productName}
                </h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-1">{product.category}</p>
                <p className="text-xl font-extrabold text-gray-900 mb-4">₹{product.price}</p>
                <button
                  onClick={() => handleProductClick(product)}
                  className="absolute bottom-4 right-4 py-2 px-4 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700 shadow-lg transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />



      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
  <DialogTitle sx={{ fontWeight: 600, textAlign: 'center', color: '#333', paddingBottom: '10px' }}>
    Please log in first
  </DialogTitle>
  <DialogContent sx={{ paddingTop: '10px', paddingBottom: '20px' }}>
    <Typography variant="body1" sx={{ marginBottom: '20px', color: '#555' }}>
      You need to be logged in to view more information or make inquiries. Would you like to log in now?
    </Typography>
  </DialogContent>
  <DialogActions sx={{ padding: '10px' }}>
    <Button
      onClick={handleCloseDialog}
      color="secondary"
      variant="outlined"
      sx={{
        padding: '8px 16px',
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
      onClick={handleLogin}
      color="primary"
      variant="contained"
      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
      sx={{
        padding: '8px 16px',
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

    </div>
  );
};

export default Home;
