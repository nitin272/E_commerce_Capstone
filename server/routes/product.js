const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller'); // Adjust the path if needed
const upload = require('../middleware/Files.middleware'); // Adjust the path if needed
const { User } = require('../controllers/user.controller');
const { authMiddleware } = require('../middleware/TokenVerify.middleware');
const isAdmin = require('../middleware/IsAdmin.middleware');



router.get('/',authMiddleware, productController.getAllProducts);

router.get('/:productId',authMiddleware, productController.getProductById);


router.post('/insert',authMiddleware,isAdmin, upload.array('images', 5), productController.createProduct);


router.put('/update/:productId',authMiddleware,isAdmin, upload.array('images', 5), productController.updateProduct);


router.delete('/:productId/images',authMiddleware,isAdmin, productController.deleteProductImage);

router.delete('/:productId',authMiddleware,isAdmin, productController.deleteProduct);

module.exports = router;
