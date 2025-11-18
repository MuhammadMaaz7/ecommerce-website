import express from "express";
import {
  getProducts,
  getProductById,
  createProductReview,
  getFeaturedProducts,
  canReviewProduct,
} from "../controllers/productController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/:id", getProductById);
router.get("/:id/can-review", protect, canReviewProduct);
router.post("/:id/reviews", protect, createProductReview);

export default router;
