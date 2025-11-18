import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";
import connectDB from "../config/db.js";

dotenv.config();
connectDB();

const products = [
  {
    name: "Premium Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation, 30-hour battery life, and premium sound quality. Perfect for music lovers and professionals.",
    price: 299.99,
    category: "Electronics",
    image: "/assets/product-headphones.jpg",
    stock: 50,
    rating: 4.8,
    numReviews: 124,
    featured: true,
  },
  {
    name: "Smart Watch Pro",
    description: "Advanced smartwatch with fitness tracking, heart rate monitor, GPS, and 7-day battery life. Stay connected and healthy.",
    price: 399.99,
    category: "Electronics",
    image: "/assets/product-watch.jpg",
    stock: 35,
    rating: 4.9,
    numReviews: 89,
    featured: true,
  },
  {
    name: "Designer Backpack",
    description: "Stylish and functional leather backpack with laptop compartment, multiple pockets, and water-resistant material.",
    price: 129.99,
    category: "Fashion",
    image: "/assets/product-backpack.jpg",
    stock: 75,
    rating: 4.7,
    numReviews: 156,
    featured: true,
  },
  {
    name: "Running Sneakers",
    description: "Comfortable running shoes with advanced cushioning, breathable mesh, and durable sole. Perfect for athletes.",
    price: 159.99,
    category: "Sports",
    image: "/assets/product-sneakers.jpg",
    stock: 100,
    rating: 4.6,
    numReviews: 203,
    featured: true,
  },
  {
    name: "Smartphone 15 Pro",
    description: "Latest flagship smartphone with 6.7-inch display, 256GB storage, triple camera system, and 5G connectivity.",
    price: 999.99,
    category: "Electronics",
    image: "/assets/product-phone.jpg",
    stock: 25,
    rating: 4.9,
    numReviews: 312,
    featured: true,
  },
  {
    name: "Classic Sunglasses",
    description: "Timeless designer sunglasses with UV protection, polarized lenses, and premium frame construction.",
    price: 89.99,
    category: "Accessories",
    image: "/assets/product-sunglasses.jpg",
    stock: 150,
    rating: 4.5,
    numReviews: 87,
    featured: true,
  },
  {
    name: "Wireless Earbuds",
    description: "Compact wireless earbuds with active noise cancellation, 24-hour battery life with case, and crystal clear sound.",
    price: 199.99,
    category: "Electronics",
    image: "/assets/product-headphones.jpg",
    stock: 80,
    rating: 4.7,
    numReviews: 145,
    featured: false,
  },
  {
    name: "Leather Watch",
    description: "Elegant leather strap watch with automatic movement, sapphire crystal, and water resistance.",
    price: 249.99,
    category: "Accessories",
    image: "/assets/product-watch.jpg",
    stock: 40,
    rating: 4.8,
    numReviews: 92,
    featured: false,
  },
];

const seedProducts = async () => {
  try {
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log("✅ Products seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    process.exit(1);
  }
};

seedProducts();
