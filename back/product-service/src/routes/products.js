const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// For simplicity, everyone can view, but only authenticated could create/update (logic can be added later)
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
