import express from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats,
  getAllUsers,
} from "../controllers/adminController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(admin);

// Dashboard
router.get("/stats", getDashboardStats);

// Products
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

// Orders
router.get("/orders", getAllOrders);
router.put("/orders/:id/status", updateOrderStatus);

// Users
router.get("/users", getAllUsers);

export default router;
