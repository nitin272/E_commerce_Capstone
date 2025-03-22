import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Container,
    Box,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    CircularProgress,
    IconButton,
    Paper,
    InputBase,
    InputAdornment
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import Select from 'react-select';
import { debounce } from 'lodash';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Lottie from 'lottie-react';
import successAnimation from '../assets/animations/save.json';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [open, setOpen] = useState(false);
    const [productData, setProductData] = useState({
        productName: '',
        category: '',
        stock: '',
        productImg: []
    });
    const [editMode, setEditMode] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [filteredNames, setFilteredNames] = useState([]);
    const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const apiUrl = "https://e-commerce-capstone.onrender.com";

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${apiUrl}/products`, {
                withCredentials: true
            });
            setProducts(response.data);

            const uniqueCategories = [...new Set(response.data.map(product => product.category))];
            setCategories(uniqueCategories.map(category => ({ value: category, label: category })));
        } catch (error) {
            toast.error('Error fetching products.');
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        const productNames = products.map(product => ({
            value: product.productName,
            label: product.productName
        }));
        setFilteredNames(productNames);

        const uniqueCategories = [...new Set(products.map(product => product.category))];
        const categoryOptions = uniqueCategories.map(category => ({
            value: category,
            label: category
        }));
        setFilteredCategories(categoryOptions);
    }, [products]);

    const handleEditProduct = async (productId, updatedData) => {
        try {
            await axios.put(`${apiUrl}/products/update/${productId}`, updatedData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            setSuccessMessage('Product Updated Successfully!');
            setShowSuccessAnimation(true);
            setTimeout(() => {
                setShowSuccessAnimation(false);
                setOpen(false);
                setEditMode(false);
                fetchProducts();
            }, 2000);
        } catch (error) {
            toast.error('Error updating product.');
        }
    };

    const handleAddProduct = async (newData) => {
        try {
            await axios.post(`${apiUrl}/products/insert`, newData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            setSuccessMessage('Product Created Successfully!');
            setShowSuccessAnimation(true);
            setTimeout(() => {
                setShowSuccessAnimation(false);
                setOpen(false);
                fetchProducts();
            }, 2000);
        } catch (error) {
            toast.error('Error adding product.');
        }
    };

    const handleDeleteProduct = async (productId) => {
        try {
            await axios.delete(`${apiUrl}/products/${productId}`, {
                withCredentials: true
            });
            setSuccessMessage('Product Deleted Successfully!');
            setShowSuccessAnimation(true);
            setTimeout(() => {
                setShowSuccessAnimation(false);
                fetchProducts();
            }, 2000);
        } catch (error) {
            toast.error('Error deleting product.');
        }
    };

    const handleDeleteImage = async (imageUrl, index) => {
        if (!currentProduct?._id) return;

        try {
            await axios.delete(`${apiUrl}/products/${currentProduct._id}/images`, {
                data: { imageUrls: [imageUrl] },
                withCredentials: true
            });

            setImagePreviews(prev => prev.filter((_, i) => i !== index));
            setProductData(prev => ({
                ...prev,
                productImg: prev.productImg.filter((_, i) => i !== index)
            }));

            toast.success('Image deleted successfully.');
        } catch (error) {
            toast.error('Error deleting image.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('productName', productData.productName);
        formData.append('category', productData.category);
        formData.append('stock', productData.stock);

        productData.productImg.forEach(file => {
            formData.append('images', file);
        });

        if (editMode && currentProduct) {
            handleEditProduct(currentProduct._id, formData);
        } else {
            handleAddProduct(formData);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData({ ...productData, [name]: value });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + imagePreviews.length > 10) {
            toast.error('You can only upload a maximum of 10 images.');
            return;
        }

        const newImagePreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newImagePreviews]);
        setProductData(prev => ({ ...prev, productImg: [...prev.productImg, ...files] }));
    };

    const handleRemoveImage = (index) => {
        const imageUrl = imagePreviews[index];
        handleDeleteImage(imageUrl, index);
    };

    const openFormDialog = (product = null) => {
        if (product) {
            setProductData({
                productName: product.productName || '',
                category: product.category || '',
                stock: product.stock || '',
                productImg: []
            });
            setImagePreviews(product.productImgUrls || []);
            setCurrentProduct(product);
            setEditMode(true);
        } else {
            setProductData({
                productName: '',
                category: '',
                stock: '',
                productImg: []
            });
            setImagePreviews([]);
            setCurrentProduct(null);
            setEditMode(false);
        }
        setOpen(true);
    };

    const handleSearchChange = (inputValue) => {
        setSearchTerm(inputValue);
    };

    const handleCategoryChange = (selectedOption) => {
        setSelectedCategory(selectedOption);
    };

    const debouncedSearch = debounce(handleSearchChange, 300);

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            borderRadius: '12px',
            border: 'none',
            boxShadow: state.isFocused ? '0 0 0 2px #2563eb' : '0 1px 3px rgba(0,0,0,0.1)',
            '&:hover': {
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            },
            minHeight: '50px',
            backgroundColor: '#f8fafc',
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#2563eb' : state.isFocused ? '#e5e7eb' : 'white',
            color: state.isSelected ? 'white' : '#374151',
            padding: '12px 16px',
            '&:hover': {
                backgroundColor: state.isSelected ? '#2563eb' : '#e5e7eb',
            },
        }),
        menu: (provided) => ({
            ...provided,
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            zIndex: 1000,
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#64748b',
        }),
    };

    const searchSection = (
        <div className="w-full max-w-7xl mx-auto px-4 pt-16 md:pt-24">
            <div className="flex flex-col space-y-6 md:space-y-8">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 tracking-tight">
                        Manage Products
                    </h2>
                    <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto px-4">
                        Add, edit, or remove products from your inventory
                    </p>
                    <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
                </div>

                <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 w-full">
                    <div className="w-full">
                        <Paper
                            elevation={0}
                            className="flex items-center px-4 py-2 rounded-xl bg-gray-50 shadow-sm hover:shadow-md transition-all duration-300"
                            sx={{
                                border: '1px solid #e5e7eb',
                                '&:hover': {
                                    borderColor: '#2563eb',
                                },
                                minHeight: { xs: '56px', md: '50px' }
                            }}
                        >
                            <SearchIcon className="text-gray-400 mr-2" />
                            <Select
                                options={[...filteredCategories, ...filteredNames]}
                                onInputChange={debouncedSearch}
                                onChange={handleCategoryChange}
                                placeholder="Search products..."
                                isClearable
                                isSearchable
                                styles={{
                                    ...customStyles,
                                    container: (provided) => ({
                                        ...provided,
                                        width: '100%',
                                    }),
                                    control: (provided) => ({
                                        ...provided,
                                        minHeight: '44px',
                                        border: 'none',
                                        boxShadow: 'none',
                                        backgroundColor: 'transparent',
                                        '&:hover': {
                                            border: 'none',
                                        }
                                    }),
                                }}
                                className="w-full"
                                components={{
                                    DropdownIndicator: () => null,
                                    IndicatorSeparator: () => null,
                                }}
                            />
                        </Paper>
                    </div>

                    <div className="w-full">
                        <Paper
                            elevation={0}
                            className="flex items-center px-4 py-2 rounded-xl bg-gray-50 shadow-sm hover:shadow-md transition-all duration-300"
                            sx={{
                                border: '1px solid #e5e7eb',
                                '&:hover': {
                                    borderColor: '#2563eb',
                                },
                                minHeight: { xs: '56px', md: '50px' }
                            }}
                        >
                            <FilterListIcon className="text-gray-400 mr-2" />
                            <Select
                                options={filteredCategories}
                                onChange={handleCategoryChange}
                                placeholder="Filter by category"
                                isClearable
                                styles={{
                                    ...customStyles,
                                    container: (provided) => ({
                                        ...provided,
                                        width: '100%',
                                    }),
                                    control: (provided) => ({
                                        ...provided,
                                        minHeight: '44px',
                                        border: 'none',
                                        boxShadow: 'none',
                                        backgroundColor: 'transparent',
                                        '&:hover': {
                                            border: 'none',
                                        }
                                    }),
                                }}
                                className="w-full"
                            />
                        </Paper>
                    </div>
                </div>
            </div>
        </div>
    );

    const filteredProducts = products.filter(product => {
        const matchesSearchTerm = product.productName.toLowerCase().includes(searchTerm.toLowerCase()) || product.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? product.category === selectedCategory.value : true;
        return matchesSearchTerm && matchesCategory;
    });

    const SuccessAnimation = () => (
        <Dialog
            open={showSuccessAnimation}
            PaperProps={{
                sx: {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    overflow: 'hidden'
                }
            }}
        >
            <Box sx={{ 
                width: 300, 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 2
            }}>
                <Box sx={{ width: 150, height: 150 }}>
                    <Lottie
                        animationData={successAnimation}
                        loop={false}
                        style={{ width: '100%', height: '100%' }}
                    />
                </Box>
                <Typography
                    sx={{
                        color: '#fff',
                        fontSize: '1.2rem',
                        fontWeight: 600,
                        textAlign: 'center',
                        mt: 2,
                        backgroundColor: 'rgba(37, 99, 235, 0.9)',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    {successMessage}
                </Typography>
            </Box>
        </Dialog>
    );

    return (
        <Box className="relative">
            <Container maxWidth="2xl">
                {searchSection}
                
                <Button
                    variant="contained"
                    onClick={() => openFormDialog()}
                    sx={{
                        mt: 2,
                        mb: 4,
                        background: 'linear-gradient(to right, #2563eb, #7c3aed)',
                        textTransform: 'none',
                        px: 4,
                        py: 1.5,
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        '&:hover': {
                            background: 'linear-gradient(to right, #1d4ed8, #6d28d9)',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 6px 8px -1px rgba(0, 0, 0, 0.15)',
                        }
                    }}
                    startIcon={<i className="fas fa-plus" />}
                >
                    Add New Product
                </Button>

                <Grid container spacing={3} justifyContent="center">
                    {filteredProducts.map((product) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                            <Card 
                                sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    height: '100%', 
                                    borderRadius: '16px',
                                    border: '1px solid rgba(229, 231, 235, 0.7)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                                    }
                                }}
                            >
                                <Box sx={{ position: 'relative', pt: '100%' }}>
                                    <CardMedia
                                        component="img"
                                        image={product.productImgUrls[0] || 'default-image-url'}
                                        alt={product.productName}
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            borderTopLeftRadius: '16px',
                                            borderTopRightRadius: '16px',
                                        }}
                                    />
                                </Box>

                                <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                                    <Typography 
                                        variant="h6" 
                                        component="h2" 
                                        className="font-semibold text-gray-800 mb-2"
                                        sx={{ 
                                            fontSize: '1.1rem',
                                            lineHeight: 1.4,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical'
                                        }}
                                    >
                                        {product.productName}
                                    </Typography>
                                    <Box className="flex items-center justify-between mb-3">
                                        <Typography 
                                            className="text-gray-600 bg-gray-50 px-3 py-1 rounded-full text-sm font-medium"
                                        >
                                            Stock: {product.stock}
                                        </Typography>
                                        <Typography 
                                            className="text-gray-600 bg-gray-50 px-3 py-1 rounded-full text-sm font-medium"
                                        >
                                            {product.category}
                                        </Typography>
                                    </Box>
                                </CardContent>

                                <Box 
                                    sx={{ 
                                        p: 2, 
                                        display: 'flex', 
                                        gap: 1.5,
                                        borderTop: '1px solid rgba(229, 231, 235, 0.7)'
                                    }}
                                >
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        onClick={() => openFormDialog(product)}
                                        sx={{
                                            borderRadius: '8px',
                                            textTransform: 'none',
                                            borderColor: '#2563eb',
                                            color: '#2563eb',
                                            fontWeight: 500,
                                            '&:hover': {
                                                borderColor: '#1d4ed8',
                                                backgroundColor: 'rgba(37, 99, 235, 0.04)'
                                            }
                                        }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={() => handleDeleteProduct(product._id)}
                                        sx={{
                                            borderRadius: '8px',
                                            textTransform: 'none',
                                            backgroundColor: '#ef4444',
                                            fontWeight: 500,
                                            '&:hover': {
                                                backgroundColor: '#dc2626'
                                            }
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Dialog 
                    open={open} 
                    onClose={() => setOpen(false)}
                    PaperProps={{
                        sx: {
                            borderRadius: '20px',
                            maxWidth: '600px',
                            width: '100%',
                            backgroundColor: '#ffffff',
                            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9))',
                            backdropFilter: 'blur(10px)'
                        }
                    }}
                >
                    <DialogTitle sx={{ 
                        background: 'linear-gradient(to right, #2563eb, #7c3aed)',
                        color: 'white',
                        py: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
                            {editMode ? 'Edit Product' : 'Add New Product'}
                        </Typography>
                        <IconButton
                            onClick={() => setOpen(false)}
                            sx={{
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                }
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>

                    <form onSubmit={handleSubmit}>
                        <DialogContent sx={{ py: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        autoFocus
                                        name="productName"
                                        value={productData.productName}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                        label="Product Name"
                                        variant="outlined"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
                                                '&:hover fieldset': {
                                                    borderColor: '#2563eb',
                                                },
                                            },
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        name="category"
                                        value={productData.category}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                        label="Category"
                                        variant="outlined"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
                                            },
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        name="stock"
                                        type="number"
                                        value={productData.stock}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                        label="Stock"
                                        variant="outlined"
                                        InputProps={{
                                            inputProps: { min: 0 }
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
                                            },
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Box sx={{ 
                                        border: '2px dashed #2563eb',
                                        borderRadius: '12px',
                                        p: 3,
                                        textAlign: 'center',
                                        backgroundColor: 'rgba(37, 99, 235, 0.04)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: 'rgba(37, 99, 235, 0.08)',
                                        }
                                    }}>
                                        <Button
                                            variant="outlined"
                                            component="label"
                                            sx={{
                                                mb: 2,
                                                borderRadius: '8px',
                                                borderColor: '#2563eb',
                                                color: '#2563eb',
                                                '&:hover': {
                                                    borderColor: '#1d4ed8',
                                                    backgroundColor: 'rgba(37, 99, 235, 0.08)',
                                                }
                                            }}
                                        >
                                            <CloudUploadIcon sx={{ mr: 1 }} />
                                            Upload Images
                                            <input
                                                type="file"
                                                hidden
                                                multiple
                                                accept="image/*"
                                                onChange={handleFileChange}
                                            />
                                        </Button>
                                        <Typography variant="body2" color="textSecondary">
                                            Drag and drop your images here, or click to select files
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            Maximum 10 images allowed
                                        </Typography>
                                    </Box>
                                </Grid>

                                {/* Image Previews */}
                                {imagePreviews.length > 0 && (
                                    <Grid item xs={12}>
                                        <Box sx={{ 
                                            display: 'flex', 
                                            flexWrap: 'wrap', 
                                            gap: 1,
                                            mt: 2 
                                        }}>
                                            {imagePreviews.map((preview, index) => (
                                                <Box
                                                    key={index}
                                                    sx={{
                                                        position: 'relative',
                                                        width: 100,
                                                        height: 100,
                                                        borderRadius: '12px',
                                                        overflow: 'hidden',
                                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                                    }}
                                                >
                                                    <img
                                                        src={preview}
                                                        alt={`preview-${index}`}
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover',
                                                        }}
                                                    />
                                                    <IconButton
                                                        onClick={() => handleRemoveImage(index)}
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 4,
                                                            right: 4,
                                                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                            padding: '4px',
                                                            '&:hover': {
                                                                backgroundColor: '#ef4444',
                                                                color: 'white',
                                                            },
                                                        }}
                                                        size="small"
                                                    >
                                                        <CloseIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            ))}
                                        </Box>
                                    </Grid>
                                )}
                            </Grid>
                        </DialogContent>

                        <DialogActions sx={{ 
                            p: 3, 
                            borderTop: '1px solid rgba(0, 0, 0, 0.12)',
                            gap: 1 
                        }}>
                            <Button 
                                onClick={() => setOpen(false)}
                                variant="outlined"
                                sx={{
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    borderColor: '#94a3b8',
                                    color: '#64748b',
                                    '&:hover': {
                                        borderColor: '#64748b',
                                        backgroundColor: 'rgba(100, 116, 139, 0.04)',
                                    }
                                }}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit"
                                variant="contained"
                                sx={{
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    background: 'linear-gradient(to right, #2563eb, #7c3aed)',
                                    px: 4,
                                    '&:hover': {
                                        background: 'linear-gradient(to right, #1d4ed8, #6d28d9)',
                                    }
                                }}
                            >
                                {editMode ? 'Update Product' : 'Add Product'}
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>

                <SuccessAnimation />
                <ToastContainer />
            </Container>
        </Box>
    );
};

export default Products;
