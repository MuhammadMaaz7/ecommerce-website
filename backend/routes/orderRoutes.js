import express from "express";
import {
  createOrder,
  getOrderById,
  getMyOrders,
  updateOrderToPaid,
  updateOrderStatus,
  getAllOrders,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/pay", protect, updateOrderToPaid);
router.put("/:id/status", protect, admin, updateOrderStatus);
router.get("/", protect, admin, getAllOrders);

export default router;
