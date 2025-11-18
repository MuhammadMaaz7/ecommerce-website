import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Minus, Tag, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, isLoading, updateCart, removeFromCart, cartTotal } = useCart();

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-soft">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </main>
      </div>
    );
  }

  const cartItems = cart?.items || [];
  const subtotal = cartTotal;
  const shipping = subtotal > 0 ? 15.0 : 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen gradient-soft">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-8 text-foreground"
        >
          Shopping Cart
        </motion.h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground mb-4">Your cart is empty</p>
                <Button onClick={() => navigate("/products")}>Continue Shopping</Button>
              </Card>
            ) : (
              cartItems.map((item: any, index: number) => (
                <motion.div
                  key={item.product._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-all duration-300">
                    <div className="flex gap-6">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-lg border border-border"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{item.product.name}</h3>
                        <p className="text-2xl font-bold text-primary">${item.price.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Stock: {item.product.stock}
                        </p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.product._id)}
                          className="text-destructive hover:text-destructive transition-all"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateCart({ 
                              productId: item.product._id, 
                              quantity: Math.max(1, item.quantity - 1) 
                            })}
                            disabled={item.quantity <= 1}
                            className="h-8 w-8 transition-all"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-semibold">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateCart({ 
                              productId: item.product._id, 
                              quantity: Math.min(item.quantity + 1, item.product.stock) 
                            })}
                            disabled={item.quantity >= item.product.stock}
                            className="h-8 w-8 transition-all"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </div>

          {/* Order Summary */}
          {cartItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="p-6 sticky top-24 border border-border">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Input placeholder="Enter coupon code" className="transition-all" />
                    <Button variant="outline" className="transition-all">
                      <Tag className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2 pt-4 border-t border-border">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span>${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold pt-4 border-t border-border">
                      <span>Total</span>
                      <span className="text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="w-full bg-primary hover:bg-primary-light text-white transition-all duration-300 mb-3"
                  onClick={() => navigate("/checkout")}
                >
                  Proceed to Checkout
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full transition-all"
                  onClick={() => navigate("/products")}
                >
                  Continue Shopping
                </Button>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Cart;
