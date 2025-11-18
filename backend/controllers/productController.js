import Product from "../models/Product.js";

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const pageSize = 12;
    const page = Number(req.query.page) || 1;

    const keyword = req.query.search
      ? {
          name: {
            $regex: req.query.search,
            $options: "i",
          },
        }
      : {};

    const category = req.query.category && req.query.category !== "All"
      ? { category: req.query.category }
      : {};

    const count = await Product.countDocuments({ ...keyword, ...category });
    
    let query = Product.find({ ...keyword, ...category });

    // Sorting
    if (req.query.sort === "price_asc") {
      query = query.sort({ price: 1 });
    } else if (req.query.sort === "price_desc") {
      query = query.sort({ price: -1 });
    } else if (req.query.sort === "newest") {
      query = query.sort({ createdAt: -1 });
    } else {
      query = query.sort({ featured: -1, createdAt: -1 });
    }

    const products = await query
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "reviews.user",
      "name"
    );

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user already reviewed this product
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: "You have already reviewed this product" });
    }

    // Check if user has purchased and received this product
    const Order = (await import("../models/Order.js")).default;
    const deliveredOrder = await Order.findOne({
      user: req.user._id,
      "orderItems.product": req.params.id,
      status: "Delivered",
    });

    if (!deliveredOrder) {
      return res.status(403).json({ 
        message: "You can only review products you have purchased and received" 
      });
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true }).limit(6);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check if user can review a product
// @route   GET /api/products/:id/can-review
// @access  Private
export const canReviewProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.json({ 
        canReview: false, 
        reason: "You have already reviewed this product" 
      });
    }

    // Check if user has purchased and received this product
    const Order = (await import("../models/Order.js")).default;
    const deliveredOrder = await Order.findOne({
      user: req.user._id,
      "orderItems.product": req.params.id,
      status: "Delivered",
    });

    if (!deliveredOrder) {
      return res.json({ 
        canReview: false, 
        reason: "You can only review products you have purchased and received" 
      });
    }

    res.json({ canReview: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
