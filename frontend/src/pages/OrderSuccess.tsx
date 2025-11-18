import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Package, Mail, Loader2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useOrder } from "@/hooks/useOrders";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { data: order, isLoading } = useOrder(orderId || "");

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-soft">
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="p-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
            <Button onClick={() => navigate("/products")}>Continue Shopping</Button>
          </Card>
        </main>
      </div>
    );
  }

  const estimatedDelivery = new Date(order.createdAt);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  return (
    <div className="min-h-screen gradient-soft">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block mb-6"
          >
            <CheckCircle className="h-24 w-24 text-success mx-auto animate-bounce-subtle" />
          </motion.div>
          <h1 className="text-4xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground text-lg">Thank you for your purchase</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-8 mb-6 gradient-card border border-border">
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
              <div>
                <p className="text-muted-foreground mb-1">Order Number</p>
                <p className="text-2xl font-bold text-primary">#{order._id.slice(-8).toUpperCase()}</p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground mb-1">Total Amount</p>
                <p className="text-2xl font-bold">${order.totalPrice.toFixed(2)}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Confirmation Email Sent</h3>
                  <p className="text-sm text-muted-foreground">
                    We've sent a confirmation email to your registered email address
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-accent/10 p-3 rounded-lg">
                  <Package className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Estimated Delivery</h3>
                  <p className="text-sm text-muted-foreground">
                    {estimatedDelivery.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button 
            size="lg" 
            className="flex-1 bg-primary hover:bg-primary-light text-white transition-all duration-300"
            onClick={() => navigate(`/tracking/${order._id}`)}
          >
            Track Order
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="flex-1 transition-smooth"
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </Button>
        </motion.div>
      </main>
    </div>
  );
};

export default OrderSuccess;
