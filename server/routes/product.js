const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller'); // Adjust the path if needed
const upload = require('../middleware/Files.middleware'); // Adjust the path if needed
const { User } = require('../controllers/user.controller');




router.get('/', productController.getAllProducts);

router.get('/:productId', productController.getProductById);


router.post('/insert', upload.array('images', 5), productController.createProduct);


router.put('/update/:productId', upload.array('images', 5), productController.updateProduct);


router.delete('/:productId/images', productController.deleteProductImage);

router.delete('/:productId',  productController.deleteProduct);

module.exports = router;
