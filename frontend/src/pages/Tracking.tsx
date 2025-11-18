import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Package, Truck, CheckCircle, Loader2, Mail } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useOrder } from "@/hooks/useOrders";

const statusSteps = [
  { status: "Pending", icon: Mail, label: "Awaiting Confirmation" },
  { status: "Confirmed", icon: CheckCircle, label: "Confirmed" },
  { status: "Processing", icon: Package, label: "Processing" },
  { status: "Shipped", icon: Truck, label: "Shipped" },
  { status: "Delivered", icon: CheckCircle, label: "Delivered" },
];

const Tracking = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useOrder(id || "");

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-soft">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </main>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen gradient-soft">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="p-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
            <p className="text-muted-foreground mb-6">
              We couldn't find the order you're looking for
            </p>
            <Button onClick={() => navigate("/products")}>Continue Shopping</Button>
          </Card>
        </main>
      </div>
    );
  }

  const currentStatusIndex = statusSteps.findIndex((step) => step.status === order.status);
  const estimatedDelivery = new Date(order.createdAt);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  return (
    <div className="min-h-screen gradient-soft">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            ← Back
          </Button>
          <h1 className="text-4xl font-bold mb-2">Track Your Order</h1>
          <p className="text-muted-foreground">
            Order #{order._id.slice(-8).toUpperCase()}
          </p>
        </motion.div>

        {/* Pending Order Warning */}
        {order.status === "Pending" && !order.isConfirmed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 mb-6 bg-yellow-500/10 border-yellow-500/20">
              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">⏳ Confirmation Required</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Your order is awaiting confirmation. Please check your email and click the confirmation link to complete your order.
                  </p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-400">
                    ⚠️ This order will be automatically cancelled if not confirmed within 24 hours.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Order Status Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-8 mb-6 border border-border">
            <h2 className="text-2xl font-bold mb-8">Order Status</h2>
            
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-8 left-0 right-0 h-1 bg-border">
                <div 
                  className="h-full bg-primary transition-all duration-500"
                  style={{ 
                    width: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%` 
                  }}
                />
              </div>

              {/* Status Steps */}
              <div className="relative grid grid-cols-5 gap-2">
                {statusSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = index <= currentStatusIndex;
                  const isCurrent = index === currentStatusIndex;

                  return (
                    <motion.div
                      key={step.status}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex flex-col items-center"
                    >
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${
                          isCompleted
                            ? "bg-primary text-white shadow-lg"
                            : "bg-secondary text-muted-foreground"
                        } ${isCurrent ? "ring-4 ring-primary/30 scale-110" : ""}`}
                      >
                        <Icon className="h-8 w-8" />
                      </div>
                      <p
                        className={`text-sm font-medium text-center ${
                          isCompleted ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </p>
                      {isCurrent && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-xs text-primary mt-1"
                        >
                          Current
                        </motion.p>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Delivery Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 border border-border">
              <h3 className="text-xl font-bold mb-4">Delivery Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                  <p className="font-semibold">
                    {estimatedDelivery.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Shipping Address</p>
                  <p className="font-semibold">{order.shippingAddress.address}</p>
                  <p className="text-sm">
                    {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                  </p>
                  <p className="text-sm">{order.shippingAddress.country}</p>
                </div>
                {order.trackingNumber && (
                  <div>
                    <p className="text-sm text-muted-foreground">Tracking Number</p>
                    <p className="font-mono font-semibold">{order.trackingNumber}</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 border border-border">
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items</span>
                  <span className="font-semibold">${order.itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-semibold">${order.taxPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-semibold">
                    {order.shippingPrice === 0 ? "FREE" : `$${order.shippingPrice.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">${order.totalPrice.toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                  <p className="font-semibold">{order.paymentMethod}</p>
                  <p className={`text-sm mt-1 ${order.isPaid ? "text-green-600" : "text-yellow-600"}`}>
                    {order.isPaid ? "✓ Paid" : "⏳ Payment Pending"}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <Card className="p-6 border border-border">
            <h3 className="text-xl font-bold mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.orderItems.map((item: any) => (
                <div key={item._id} className="flex items-center gap-4 pb-4 border-b border-border last:border-0">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Tracking;
