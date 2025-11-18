import Order from "../models/Order.js";
import Product from "../models/Product.js";
import crypto from "crypto";
import { 
  sendOrderConfirmationEmail, 
  sendOrderConfirmedNotification,
  sendOrderShippedNotification,
  sendOrderDeliveredNotification 
} from "../services/emailService.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    // Verify stock availability
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.name} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${item.name}. Available: ${product.stock}`,
        });
      }
    }

    // Generate confirmation token
    const confirmationToken = crypto.randomBytes(32).toString("hex");

    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      confirmationToken,
      isConfirmed: false,
      status: "Pending", // Order starts as Pending until confirmed
    });

    const createdOrder = await order.save();

    // Send confirmation email
    try {
      await sendOrderConfirmationEmail(createdOrder, req.user.email);
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Don't fail the order creation if email fails
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (order) {
      // Check if user owns this order
      if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to view this order" });
      }
      res.json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.status = "Processing";
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;

    const order = await Order.findById(req.params.id).populate("user", "email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const previousStatus = order.status;
    order.status = status;
    
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    if (status === "Shipped") {
      order.trackingNumber = trackingNumber || `TRK${Date.now()}`;
    }

    if (status === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();

    // Send email notifications based on status change
    try {
      if (status === "Shipped" && previousStatus !== "Shipped") {
        await sendOrderShippedNotification(updatedOrder, order.user.email);
      } else if (status === "Delivered" && previousStatus !== "Delivered") {
        await sendOrderDeliveredNotification(updatedOrder, order.user.email);
      }
    } catch (emailError) {
      console.error("Failed to send status update email:", emailError);
      // Don't fail the status update if email fails
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "id name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Confirm order with token
// @route   POST /api/orders/confirm/:token
// @access  Public
export const confirmOrder = async (req, res) => {
  try {
    const { token } = req.params;

    const order = await Order.findOne({ confirmationToken: token }).populate("user", "email");

    if (!order) {
      return res.status(404).json({ message: "Invalid or expired confirmation link" });
    }

    if (order.isConfirmed) {
      return res.status(400).json({ message: "Order already confirmed" });
    }

    // Check if order is older than 24 hours
    const orderAge = Date.now() - new Date(order.createdAt).getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    
    if (orderAge > twentyFourHours) {
      order.status = "Cancelled";
      await order.save();
      return res.status(400).json({ message: "Order confirmation expired. Order has been cancelled." });
    }

    // Verify stock availability before confirming
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.name} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${item.name}. Available: ${product.stock}`,
        });
      }
    }

    // Confirm order
    order.isConfirmed = true;
    order.confirmedAt = Date.now();
    order.status = "Confirmed";
    
    // Mock payment - automatically mark as paid
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: `MOCK_${Date.now()}`,
      status: "completed",
      update_time: new Date().toISOString(),
      email_address: order.user.email,
    };

    await order.save();

    // Update product stock
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // Send confirmation notification
    try {
      await sendOrderConfirmedNotification(order, order.user.email);
    } catch (emailError) {
      console.error("Failed to send confirmation notification:", emailError);
    }

    res.json({ 
      message: "Order confirmed successfully",
      order 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
