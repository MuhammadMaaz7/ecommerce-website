import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, MapPin, CreditCard, Package, Heart, Settings, Loader2, ShoppingCart, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/hooks/useOrders";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const { wishlist, isLoading: wishlistLoading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState("orders");

  if (!user) {
    navigate("/");
    return null;
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "orders", label: "Orders", icon: Package },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen gradient-soft">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-8 text-foreground"
        >
          My Account
        </motion.h1>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-2"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  className="w-full justify-start transition-smooth"
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon className="mr-2 h-5 w-5" />
                  {tab.label}
                </Button>
              );
            })}
          </motion.aside>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-8 gradient-card border border-border">
                  <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue={user.name} className="transition-all" />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue={user.email} className="transition-all" disabled />
                    </div>
                  </div>
                  <Button className="mt-6 gradient-primary shadow-glow transition-bounce hover:scale-105">
                    Save Changes
                  </Button>
                </Card>
              </motion.div>
            )}

            {activeTab === "orders" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {ordersLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : !orders || orders.length === 0 ? (
                  <Card className="p-12 text-center border border-border">
                    <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                    <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
                    <Button 
                      className="bg-primary hover:bg-primary-light text-white"
                      onClick={() => navigate("/products")}
                    >
                      Start Shopping
                    </Button>
                  </Card>
                ) : (
                  orders.map((order: any) => {
                    const statusColors: any = {
                      Pending: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
                      Confirmed: "bg-green-500/20 text-green-700 dark:text-green-400",
                      Processing: "bg-blue-500/20 text-blue-700 dark:text-blue-400",
                      Shipped: "bg-purple-500/20 text-purple-700 dark:text-purple-400",
                      Delivered: "bg-green-500/20 text-green-700 dark:text-green-400",
                      Cancelled: "bg-red-500/20 text-red-700 dark:text-red-400",
                    };

                    return (
                      <Card key={order._id} className="p-6 hover:shadow-lg transition-all border border-border">
                        {order.status === "Pending" && !order.isConfirmed && (
                          <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                            <p className="text-sm text-yellow-700 dark:text-yellow-400">
                              ⏳ Awaiting confirmation - Check your email to confirm this order
                            </p>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">
                              Order #{order._id.slice(-8).toUpperCase()}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <span className={`px-4 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                            {order.status}
                          </span>
                        </div>
                        
                        {order.status === "Delivered" && (
                          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                            <p className="text-sm text-green-700 dark:text-green-400 mb-2">
                              ✓ Order delivered! Share your experience with a review.
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {order.orderItems.map((item: any) => (
                                <Button
                                  key={item.product}
                                  size="sm"
                                  variant="outline"
                                  className="text-xs"
                                  onClick={() => navigate(`/product/${item.product}`)}
                                >
                                  Review {item.name}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center">
                          <p className="font-semibold">
                            {order.orderItems.length} items • ${order.totalPrice.toFixed(2)}
                          </p>
                          <Button 
                            variant="outline" 
                            className="transition-all"
                            onClick={() => navigate(`/tracking/${order._id}`)}
                          >
                            Track Order
                          </Button>
                        </div>
                      </Card>
                    );
                  })
                )}
              </motion.div>
            )}

            {activeTab === "wishlist" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {wishlistLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : !wishlist?.products || wishlist.products.length === 0 ? (
                  <Card className="p-12 text-center gradient-card border border-border">
                    <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
                    <p className="text-muted-foreground mb-6">Save items you love for later</p>
                    <Button 
                      className="gradient-primary shadow-glow transition-bounce hover:scale-105"
                      onClick={() => navigate("/products")}
                    >
                      Start Shopping
                    </Button>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wishlist.products.map((product: any) => (
                      <Card key={product._id} className="overflow-hidden hover:shadow-lg transition-all border border-border">
                        <div 
                          className="relative cursor-pointer"
                          onClick={() => navigate(`/product/${product._id}`)}
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-48 object-cover"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromWishlist(product._id);
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="p-4">
                          <h3 
                            className="font-semibold mb-2 line-clamp-2 cursor-pointer hover:text-primary"
                            onClick={() => navigate(`/product/${product._id}`)}
                          >
                            {product.name}
                          </h3>
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <span 
                                key={i}
                                className={`text-sm ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <p className="text-xl font-bold text-primary mb-3">${product.price.toFixed(2)}</p>
                          <Button 
                            className="w-full bg-primary hover:bg-primary-light text-white"
                            onClick={() => {
                              addToCart({ 
                                productId: product._id, 
                                quantity: 1,
                                product: {
                                  _id: product._id,
                                  name: product.name,
                                  price: product.price,
                                  image: product.image,
                                  stock: product.stock
                                }
                              });
                            }}
                            disabled={product.stock === 0}
                          >
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
