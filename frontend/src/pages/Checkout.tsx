import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Lock, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useCreateOrder } from "@/hooks/useOrders";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, isLoading: cartLoading, clearCart } = useCart();
  const { mutate: createOrder, isPending } = useCreateOrder();
  const { toast } = useToast();

  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "USA",
  });

  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [saveAddress, setSaveAddress] = useState(false);
  const [savePayment, setSavePayment] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");

  if (cartLoading) {
    return (
      <div className="min-h-screen gradient-soft">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </main>
      </div>
    );
  }

  const cartItems = cart?.items || [];
  
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen gradient-soft">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="p-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add some products before checking out</p>
            <Button onClick={() => navigate("/products")}>Continue Shopping</Button>
          </Card>
        </main>
      </div>
    );
  }

  const subtotal = cart?.totalPrice || 0;
  const taxRate = 0.1; // 10% tax
  const taxPrice = subtotal * taxRate;
  const shippingPrice = subtotal > 100 ? 0 : 15.0;
  const totalPrice = subtotal + taxPrice + shippingPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate guest email if not logged in
    if (!user && !guestEmail) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide your email address",
      });
      return;
    }

    // Validate shipping info
    if (!shippingInfo.address || !shippingInfo.city || !shippingInfo.postalCode) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all shipping details",
      });
      return;
    }

    // Prepare order data
    const orderData = {
      orderItems: cartItems.map((item: any) => ({
        product: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        image: item.product.image,
        price: item.price,
      })),
      shippingAddress: shippingInfo,
      paymentMethod,
      itemsPrice: subtotal,
      taxPrice,
      shippingPrice,
      totalPrice,
      guestEmail: user ? undefined : guestEmail,
      saveAddress: user ? saveAddress : undefined,
      savePayment: user ? savePayment : undefined,
    };

    if (user) {
      createOrder(orderData, {
        onSuccess: (data) => {
          setTimeout(() => {
            clearCart();
            navigate(`/order-success?orderId=${data._id}`);
          }, 1000);
        },
      });
    } else {
      // Guest checkout - simulate order creation
      toast({
        title: "Order Placed!",
        description: "Your order has been placed successfully.",
      });
      setTimeout(() => {
        clearCart();
        navigate(`/order-success?guest=true`);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen gradient-soft">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-8 text-foreground"
        >
          Secure Checkout
        </motion.h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="p-6 border border-border">
                  <h2 className="text-xl font-bold mb-4">
                    {user ? "Shipping Information" : "Contact & Shipping Information"}
                  </h2>
                  <div className="space-y-4">
                    {!user && (
                      <div>
                        <Label htmlFor="guestEmail">Email Address</Label>
                        <Input 
                          id="guestEmail" 
                          type="email"
                          required 
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          placeholder="your@email.com"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          We'll send order confirmation to this email
                        </p>
                      </div>
                    )}
                    <div>
                      <Label htmlFor="address">Street Address</Label>
                      <Input 
                        id="address" 
                        required 
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                        placeholder="123 Main St"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input 
                          id="city" 
                          required 
                          value={shippingInfo.city}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                          placeholder="New York"
                        />
                      </div>
                      <div>
                        <Label htmlFor="postalCode">ZIP Code</Label>
                        <Input 
                          id="postalCode" 
                          required 
                          value={shippingInfo.postalCode}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
                          placeholder="10001"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input 
                        id="country" 
                        required 
                        value={shippingInfo.country}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                      />
                    </div>
                    {user && (
                      <div className="flex items-center space-x-2 pt-2">
                        <input
                          type="checkbox"
                          id="saveAddress"
                          checked={saveAddress}
                          onChange={(e) => setSaveAddress(e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300"
                        />
                        <Label htmlFor="saveAddress" className="text-sm font-normal cursor-pointer">
                          Save this address for future orders
                        </Label>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="p-6 border border-border">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-bold">Payment Method</h2>
                  </div>
                  <div className="space-y-3">
                    {["Card", "PayPal", "Cash on Delivery"].map((method) => (
                      <label
                        key={method}
                        className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          paymentMethod === method
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method}
                          checked={paymentMethod === method}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-4 h-4"
                        />
                        <span className="font-medium">{method}</span>
                      </label>
                    ))}
                  </div>
                  {user && (
                    <div className="flex items-center space-x-2 pt-4 border-t border-border mt-4">
                      <input
                        type="checkbox"
                        id="savePayment"
                        checked={savePayment}
                        onChange={(e) => setSavePayment(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <Label htmlFor="savePayment" className="text-sm font-normal cursor-pointer">
                        Save this payment method for future orders
                      </Label>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground mt-4">
                    Note: This is a demo. No real payment will be processed.
                  </p>
                </Card>
              </motion.div>

              {/* Order Items */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="p-6 border border-border">
                  <h2 className="text-xl font-bold mb-4">Order Items</h2>
                  <div className="space-y-3">
                    {cartItems.map((item: any) => (
                      <div key={item.product._id} className="flex items-center gap-4 pb-3 border-b border-border last:border-0">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="p-6 sticky top-24 border border-border">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{cartItems.length} items</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (10%)</span>
                    <span className="font-semibold">${taxPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-semibold">
                      {shippingPrice === 0 ? "FREE" : `$${shippingPrice.toFixed(2)}`}
                    </span>
                  </div>
                  {subtotal > 100 && (
                    <p className="text-xs text-green-600">Free shipping on orders over $100!</p>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-3 border-t border-border">
                    <span>Total</span>
                    <span className="text-primary">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  type="submit"
                  size="lg" 
                  className="w-full bg-primary hover:bg-primary-light text-white transition-all duration-300 mb-3"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Place Order
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Your payment information is secure and encrypted
                </p>
              </Card>
            </motion.div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Checkout;
