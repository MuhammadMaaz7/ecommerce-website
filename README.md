# 🛍️ ShopVerse - Modern E-Commerce Platform

A full-stack e-commerce application built with React, Node.js, Express, and MongoDB. Features a modern UI with smooth animations, comprehensive shopping functionality, and an admin dashboard.

![ShopVerse](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

### 🛒 Shopping Experience
- **Product Browsing** - Browse products with filtering, sorting, and search
- **Guest Shopping** - Browse and add to cart without an account
- **Shopping Cart** - Add, update, and remove items with real-time updates
- **Wishlist** - Save favorite products for later (requires login)
- **Product Reviews** - Verified purchase reviews with ratings
- **Order Tracking** - Track order status from placement to delivery
- **Secure Checkout** - Login required to place orders

### 👤 User Features
- **Authentication** - Secure login and registration
- **User Profile** - Manage personal information
- **Order History** - View all past orders
- **Saved Addresses** - Store multiple shipping addresses
- **Review Management** - Write reviews for delivered products

### 🔧 Admin Dashboard
- **Dashboard Analytics** - View sales, orders, and user statistics
- **Product Management** - Create, update, and delete products
- **Order Management** - Update order status and tracking numbers
- **User Management** - View and manage user accounts

### 🎨 UI/UX
- **Modern Design** - Clean, responsive interface with Tailwind CSS
- **Smooth Animations** - Framer Motion for delightful interactions
- **Dark Mode Support** - Automatic theme switching
- **Mobile Responsive** - Optimized for all screen sizes

## 🚀 Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TanStack Query** - Data fetching and caching
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Shadcn/ui** - UI components

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Clone the Repository
```bash
git clone https://github.com/yourusername/shopverse.git
cd shopverse
```

### Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your configuration
```

**Backend Environment Variables:**
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### Frontend Setup
```bash
cd frontend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your configuration
```

**Frontend Environment Variables:**
```env
VITE_API_URL=http://localhost:5000/api
```

### Seed Database (Optional)
```bash
cd backend
npm run seed
```

## 🏃 Running the Application

### Development Mode

**Backend:**
```bash
cd backend
npm run dev
```
Server runs on `http://localhost:5000`

**Frontend:**
```bash
cd frontend
npm run dev
```
App runs on `http://localhost:5173`

### Production Build

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## 📁 Project Structure

```
shopverse/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── scripts/         # Utility scripts
│   └── server.js        # Entry point
├── frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # React context
│   │   ├── hooks/       # Custom hooks
│   │   ├── lib/         # Utilities
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   └── main.tsx     # Entry point
│   └── index.html
└── README.md
```

## 🔑 Default Admin Account

After seeding the database, you can create an admin account:

```bash
cd backend
npm run make-admin your@email.com
```

## 🌟 Key Features Explained

### Email Notifications
Automated email notifications keep customers informed:
- **Order Confirmation** - Sent immediately after order placement with confirmation link
- **Order Confirmed** - Sent after email confirmation
- **Order Shipped** - Includes tracking number and tracking link
- **Order Delivered** - Includes review prompts for purchased products

### Guest Shopping
Users can browse products and add items to cart without creating an account. Cart data is stored in localStorage for guests and synced to the database for authenticated users. However, users must login or register to complete checkout and place orders.

### Verified Reviews
Only users who have purchased and received a product can write reviews, ensuring authentic feedback.

### Real-time Updates
Using TanStack Query for efficient data fetching and caching, providing instant UI updates across the application.

### Wishlist
Users can save products to their wishlist for easy access later. Wishlist data persists across sessions.

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured` - Get featured products
- `POST /api/products/:id/reviews` - Add review
- `GET /api/products/:id/can-review` - Check review eligibility

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:productId` - Update cart item
- `DELETE /api/cart/:productId` - Remove from cart

### Wishlist
- `GET /api/wishlist` - Get user wishlist
- `POST /api/wishlist/:productId` - Add to wishlist
- `DELETE /api/wishlist/:productId` - Remove from wishlist

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/myorders` - Get user orders
- `GET /api/orders/:id` - Get order by ID

### Admin
- `GET /api/admin/stats` - Get dashboard stats
- `GET /api/admin/users` - Get all users
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Your Name - [@yourhandle](https://twitter.com/yourhandle)

Project Link: [https://github.com/yourusername/shopverse](https://github.com/yourusername/shopverse)

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)