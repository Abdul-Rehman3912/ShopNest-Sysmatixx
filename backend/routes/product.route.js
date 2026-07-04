const express = require("express");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller.js");
const { protectRoute } = require("../middlewares/auth.Middleware");
const { admin } = require("../middlewares/admin.Middleware");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(protectRoute, admin, upload.single("image"), createProduct);
router
  .route("/:id")
  .get(getProductById)
  .put(protectRoute, admin, upload.single("image"), updateProduct)
  .delete(protectRoute, admin, deleteProduct);

module.exports = router;
