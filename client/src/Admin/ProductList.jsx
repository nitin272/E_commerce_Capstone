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
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SearchFilter from '../components/Search'; // Ensure this file contains the search filter component

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [open, setOpen] = useState(false);
    const [productData, setProductData] = useState({
        productName: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        productImg: []
    });
    const [editMode, setEditMode] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const apiUrl = import.meta.env.VITE_APP_API_URL;

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/products`, {
                withCredentials: true // Include credentials in the request
            });
            setProducts(response.data);

            const uniqueCategories = [...new Set(response.data.map(product => product.category))];
            setCategories(uniqueCategories.map(category => ({ value: category, label: category })));
        } catch (error) {
            toast.error('Error fetching products.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleEditProduct = async (productId, updatedData) => {
        setLoading(true);
        try {
            await axios.put(`${apiUrl}/products/update/${productId}`, updatedData, {
                headers: { 'Content-Type': 'multipart/form-data' 
                },
                withCredentials: true

            });
            toast.success('Product updated successfully.');
            fetchProducts();
            setOpen(false);
            setEditMode(false);
        } catch (error) {
            toast.error('Error updating product.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddProduct = async (newData) => {
        setLoading(true);
        try {
            await axios.post(`${apiUrl}/products/insert`, newData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            toast.success('Product added successfully.');
            fetchProducts();
            setOpen(false);
        } catch (error) {
            toast.error('Error adding product.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (productId) => {
        setLoading(true);
        try {
            // Corrected URL with a leading slash before the productId
            await axios.delete(`${apiUrl}/products/${productId}`, {
                withCredentials: true // Include credentials in the request
            });
            toast.success('Product deleted successfully.');
            fetchProducts();
        } catch (error) {
            toast.error('Error deleting product.');
        } finally {
            setLoading(false);
        }
    };
    

    const handleDeleteImage = async (imageUrl, index) => {
        if (!currentProduct?._id) return;

        setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('productName', productData.productName);
        formData.append('description', productData.description);
        formData.append('price', productData.price);
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
                description: product.description || '',
                price: product.price || '',
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
                description: '',
                price: '',
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

    const filteredProducts = products.filter(product => {
        const matchesSearchTerm = product.productName.toLowerCase().includes(searchTerm.toLowerCase()) || product.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? product.category === selectedCategory.value : true;
        return matchesSearchTerm && matchesCategory;
    });

    return (
        <>
            <Container>
                <SearchFilter
                    categories={categories}
                    onSearchChange={(value) => setSearchTerm(value)}
                    onCategoryChange={(option) => setSelectedCategory(option)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => openFormDialog()}
                    sx={{ mb: 15 }}
                >
                    Add Product
                </Button>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid
                        container
                        spacing={3}
                        sx={{
                            mb: 4,
                            justifyContent: 'center', // Center the grid items horizontally
                            alignItems: 'flex-start', // Align items to the start vertically
                        }}
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredProducts.map((product) => (
                                <div
                                    key={product._id}
                                    className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-lg transition-transform transform hover:scale-105"
                                >
                                    <img
                                        src={product.productImgUrls[0] || 'default-image-url'}
                                        alt={product.productName}
                                        className="h-48 w-full object-cover rounded-t-lg"
                                    />
                                    <div className="flex-grow p-4">
                                        <h2 className="text-lg font-semibold text-indigo-800 mb-2">
                                            {product.productName}
                                        </h2>
                                        <p className="text-gray-700 mb-2">
                                            <strong className="text-gray-900">Category:</strong> {product.category}
                                        </p>
                                        <p className="text-gray-700 mb-2">
                                            <strong className="text-gray-900">Price:</strong> ₹{product.price.toFixed(2)}
                                        </p>
                                        <p className="text-gray-700 mb-2">
                                            <strong className="text-gray-900">Stock:</strong> {product.stock}
                                        </p>
                                        <p className="text-gray-700 mb-4">
                                            <strong className="text-gray-900">Description:</strong> {product.description}
                                        </p>
                                    </div>

                                    <Box
                                        sx={{
                                            p: 2,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            borderRadius: 2, // Optional: Add rounded corners
                                        }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => openFormDialog(product)}
                                            sx={{ mr: 1, flexGrow: 1 }}>
                                            Edit
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => handleDeleteProduct(product._id)}
                                            sx={{ flexGrow: 1 }}>
                                            Delete
                                        </Button>
                                    </Box>



                                </div>
                            ))}
                        </div>
                    </Grid>


                )}
                {/* Form Dialog */}
                <Dialog open={open} onClose={() => setOpen(false)}>
                    <DialogTitle>
                        {editMode ? 'Edit Product' : 'Add New Product'}
                        <IconButton
                            aria-label="close"
                            onClick={() => setOpen(false)}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: (theme) => theme.palette.grey[500],
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <form onSubmit={handleSubmit}>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Product Name"
                                name="productName"
                                value={productData.productName}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                            <TextField
                                margin="dense"
                                label="Description"
                                name="description"
                                value={productData.description}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                            <TextField
                                margin="dense"
                                label="Price"
                                name="price"
                                type="number"
                                value={productData.price}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                            <TextField
                                margin="dense"
                                label="Category"
                                name="category"
                                value={productData.category}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                            <TextField
                                margin="dense"
                                label="Stock"
                                name="stock"
                                type="number"
                                value={productData.stock}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                            <Button
                                variant="outlined"
                                component="label"
                                sx={{ mt: 2, mb: 2 }}
                            >
                                Upload Images
                                <input
                                    type="file"
                                    hidden
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </Button>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                {imagePreviews.map((preview, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            position: 'relative',
                                            m: 1,
                                            height: 150,
                                            width: 200,
                                            borderRadius: 2,
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <img
                                            src={preview}
                                            alt="preview"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                        <IconButton
                                            onClick={() => handleRemoveImage(index)}

                                            sx={{

                                                width: 40, // Increased width

                                                height: 40, // Increased height for better touch target

                                                position: 'absolute',

                                                top: -5,

                                                right: -5,

                                                borderRadius: '50%', // Make it circular

                                                '&:hover': {

                                                    backgroundColor: 'Black', // Darker background on hover

                                                },

                                            }}
                                        ><CloseIcon sx={{ fontSize: 34, fontWeight: 'bold', color: 'red' }} /> {/* Increased icon size and made it bold */}
                                        </IconButton>

                                    </Box>
                                ))}
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpen(false)}>Cancel</Button>
                            <Button type="submit" color="primary" variant="contained">
                                {editMode ? 'Update' : 'Add'}
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>

                <ToastContainer />
            </Container>
        </>
    );
};

export default Products;
