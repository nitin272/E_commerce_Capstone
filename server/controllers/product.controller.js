const Product = require('../models/product.model'); 
const { uploadOnCloudinary, deleteFromCloudinary } = require("../utils/cloudinary");

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const files = req.files || []; 
        const filePaths = files.map(file => file.path); 
        const imageUrls = files.length > 0 ? await uploadOnCloudinary(filePaths) : []; 
        if (!req.body.productName) {
            throw new Error('Product name is required');
        }

        const product = new Product({
            ...req.body,
            productImgUrls: imageUrls // Use productImgUrls field
        });

        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error creating product:', error.message);
        res.status(400).json({ message: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        const files = req.files;
        let imageUrls = [];

        const existingProduct = await Product.findById(productId);
        if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (existingProduct.productImgUrls) {
            imageUrls = existingProduct.productImgUrls;
        }

        if (files && files.length > 0) {
            const filePaths = files.map(file => file.path);
            const newImageUrls = await uploadOnCloudinary(filePaths);
            imageUrls = [...imageUrls, ...newImageUrls];
            console.log('Images uploaded to Cloudinary:', newImageUrls);
        }

        const updateData = { ...req.body, productImgUrls: imageUrls }; // Use productImgUrls field
        const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true, runValidators: true });

        res.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error.message);
        res.status(400).json({ message: error.message });
    }
};

exports.deleteProductImage = async (req, res) => {
    try {
        const { productId } = req.params;
        const { imageUrls } = req.body;

        console.log(`Received request to delete images from product: ${productId}`);
        console.log(`Image URLs to delete: ${imageUrls}`);

        if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
            console.error('No image URLs provided or imageUrls is not an array');
            return res.status(400).json({ message: 'No image URLs provided' });
        }

        const existingProduct = await Product.findById(productId);
        if (!existingProduct) {
            console.error(`Product not found: ${productId}`);
            return res.status(404).json({ message: 'Product not found' });
        }

        if (!Array.isArray(existingProduct.productImgUrls)) {
            console.error('Product image URLs are not in the expected format');
            return res.status(500).json({ message: 'Product image URLs not in expected format' });
        }

        const imageUrlsToDelete = imageUrls.filter(url => existingProduct.productImgUrls.includes(url));
        const imageUrlsNotFound = imageUrls.filter(url => !existingProduct.productImgUrls.includes(url));

        if (imageUrlsNotFound.length > 0) {
            console.error(`Images not found in product: ${imageUrlsNotFound.join(', ')}`);
            return res.status(404).json({ message: `Images not found in product: ${imageUrlsNotFound.join(', ')}` });
        }

        for (const imageUrl of imageUrlsToDelete) {
            try {
                await deleteFromCloudinary(imageUrl);
                existingProduct.productImgUrls = existingProduct.productImgUrls.filter(url => url !== imageUrl);
            } catch (error) {
                console.error(`Error deleting image from Cloudinary: ${error.message}`);
                return res.status(500).json({ message: `Error deleting image from Cloudinary: ${error.message}` });
            }
        }

        await existingProduct.save();

        console.log(`Successfully deleted images and updated product: ${productId}`);
        res.status(200).json({ message: 'Images deleted successfully', product: existingProduct });
    } catch (error) {
        console.error('Error deleting product images:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteProductImage = async (req, res) => {
    try {
        const { productId } = req.params;
        const { imageUrls } = req.body;

        console.log(`Received request to delete images from product: ${productId}`);
        console.log(`Image URLs to delete: ${imageUrls}`);

        if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
            console.error('No image URLs provided or imageUrls is not an array');
            return res.status(400).json({ message: 'No image URLs provided' });
        }

        const existingProduct = await Product.findById(productId);
        if (!existingProduct) {
            console.error(`Product not found: ${productId}`);
            return res.status(404).json({ message: 'Product not found' });
        }

        if (!Array.isArray(existingProduct.productImgUrls)) {
            console.error('Product image URLs are not in the expected format');
            return res.status(500).json({ message: 'Product image URLs not in expected format' });
        }

        const imageUrlsToDelete = imageUrls.filter(url => existingProduct.productImgUrls.includes(url));
        const imageUrlsNotFound = imageUrls.filter(url => !existingProduct.productImgUrls.includes(url));

        if (imageUrlsNotFound.length > 0) {
            console.error(`Images not found in product: ${imageUrlsNotFound.join(', ')}`);
            return res.status(404).json({ message: `Images not found in product: ${imageUrlsNotFound.join(', ')}` });
        }

        for (const imageUrl of imageUrlsToDelete) {
            try {
                await deleteFromCloudinary(imageUrl);
                existingProduct.productImgUrls = existingProduct.productImgUrls.filter(url => url !== imageUrl);
            } catch (error) {
                console.error(`Error deleting image from Cloudinary: ${error.message}`);
                return res.status(500).json({ message: `Error deleting image from Cloudinary: ${error.message}` });
            }
        }

        await existingProduct.save();

        console.log(`Successfully deleted images and updated product: ${productId}`);
        res.status(200).json({ message: 'Images deleted successfully', product: existingProduct });
    } catch (error) {
        console.error('Error deleting product images:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
