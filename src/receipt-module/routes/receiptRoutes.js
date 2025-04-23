const router = require("express").Router();
const { protect, restrictTo } = require("../../middlewares/authMiddleware");
const {
  createReceipt,
  getReceipt,
  updateReceiptStatus,
  deleteReceipt,
  getReceiptsByUserId,
} = require("../controllers/receiptController");

router.use(protect);

router.route("/").post(restrictTo("Administrador"), createReceipt);

router
  .route("/:id")
  .get(restrictTo("Administrador", "Cliente"), getReceipt)
  .patch(restrictTo("Administrador"), updateReceiptStatus)
  .delete(restrictTo("Administrador"), deleteReceipt);

router
  .route("/user/:userId")
  .get(restrictTo("Administrador", "Cliente"), getReceiptsByUserId);

module.exports = router;
