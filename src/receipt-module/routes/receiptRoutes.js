const router = require("express").Router();
// const { protect, restrictTo } = require('../../authModule/middleware/authMiddleware');
const {
  createReceipt,
  getReceipt,
  updateReceiptStatus,
  deleteReceipt,
  getReceiptsByUserId,
} = require('../controllers/receiptController');

// Todas las rutas de facturas requieren autenticación
// router.use(protect);

// Operaciones sobre la colección de facturas
router
  .route('/')
  .post(//restrictTo('admin'), 
  createReceipt);
  // .get(restrictTo('admin', 'cliente'), getAllReceipts); // Pending: implementar listado de facturas

// Operaciones sobre una factura específica
router
  .route('/:id')
  .get(//restrictTo('admin', 'cliente'),
  getReceipt)
  .patch(//restrictTo('admin'),
  updateReceiptStatus)
  .delete(//restrictTo('admin'),
  deleteReceipt);

router
  .route('/user/:userId')
  .get(//restrictTo('admin', 'cliente'),
  getReceiptsByUserId);

module.exports = router;