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
import SearchFilter from '../components/Search'; 

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
    const apiUrl = "https://e-commerce-capstone.onrender.com";

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/products`, {
                withCredentials: true 
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
        
            await axios.delete(`${apiUrl}/products/${productId}`, {
                withCredentials: true
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
                    <Grid container spacing={3} justifyContent="center">
                        {filteredProducts.map((product) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                                <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 2, boxShadow: 3 }}>
                                <CardMedia
                                        component="img"
                                        image={product.productImgUrls[0] || 'default-image-url'}
                                        alt={product.productName}
                                        sx={{
                                            width: '100%', 
                                            height: 200, 
                                            objectFit: 'contain', 
                                            borderTopLeftRadius: 2,
                                            borderTopRightRadius: 2,
                                            backgroundColor: '#f5f5f5', 
                                        }}
                                    />

                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" component="h2" color="primary">
                                            {product.productName}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            <strong>Stock:</strong> {product.stock}
                                        </Typography>
                                    </CardContent>
                                    <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e0e0e0' }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => openFormDialog(product)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => handleDeleteProduct(product._id)}
                                        >
                                            Delete
                                        </Button>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
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
        height: 120,
        width: "100",
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: 1, 
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
          position: 'absolute',
          top: 5, 
          right: 5, 
          width: 30, 
          height: 30,
          backgroundColor: 'white', 
          color: 'red', 
          boxShadow: 1, 
          '&:hover': {
            backgroundColor: 'red', 
            color: 'white', 
          },
        }}
      >
        <CloseIcon sx={{ fontSize: 22 }} />
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
