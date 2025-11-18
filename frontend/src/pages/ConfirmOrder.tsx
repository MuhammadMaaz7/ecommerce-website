import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ordersAPI } from "@/services/api";

const ConfirmOrder = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const confirmOrder = async () => {
      try {
        const response = await ordersAPI.confirmOrder(token!);
        setStatus("success");
        setMessage(response.message);
        setOrder(response.order);
      } catch (error: any) {
        setStatus("error");
        setMessage(error.message || "Failed to confirm order");
      }
    };

    if (token) {
      confirmOrder();
    }
  }, [token]);

  return (
    <div className="min-h-screen gradient-soft">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-12 text-center border border-border">
            {status === "loading" && (
              <>
                <Loader2 className="h-16 w-16 mx-auto mb-4 text-primary animate-spin" />
                <h2 className="text-2xl font-bold mb-2">Confirming Your Order</h2>
                <p className="text-muted-foreground">Please wait while we process your confirmation...</p>
              </>
            )}

            {status === "success" && (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <CheckCircle className="h-20 w-20 mx-auto mb-4 text-green-500" />
                </motion.div>
                <h2 className="text-3xl font-bold mb-4 text-green-600">Order Confirmed!</h2>
                <p className="text-lg text-muted-foreground mb-6">{message}</p>
                
                {order && (
                  <div className="bg-secondary/50 p-6 rounded-lg mb-6 text-left">
                    <h3 className="font-semibold text-lg mb-3">Order Details</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Order ID:</strong> #{order._id.slice(-8).toUpperCase()}</p>
                      <p><strong>Status:</strong> <span className="text-green-600 font-semibold">{order.status}</span></p>
                      <p><strong>Total:</strong> ${order.totalPrice.toFixed(2)}</p>
                      <p><strong>Items:</strong> {order.orderItems.length} item(s)</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg"
                    className="bg-primary hover:bg-primary-light text-white"
                    onClick={() => navigate("/profile")}
                  >
                    <Package className="mr-2 h-5 w-5" />
                    View My Orders
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    onClick={() => navigate("/products")}
                  >
                    Continue Shopping
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground mt-6">
                  A confirmation email has been sent to your email address.
                </p>
              </>
            )}

            {status === "error" && (
              <>
                <XCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
                <h2 className="text-2xl font-bold mb-2 text-red-600">Confirmation Failed</h2>
                <p className="text-muted-foreground mb-6">{message}</p>
                
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
                  <p className="text-sm text-red-700 dark:text-red-400">
                    This confirmation link may have expired or is invalid. 
                    Confirmation links are valid for 24 hours only.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg"
                    variant="outline"
                    onClick={() => navigate("/profile")}
                  >
                    View My Orders
                  </Button>
                  <Button 
                    size="lg"
                    className="bg-primary hover:bg-primary-light text-white"
                    onClick={() => navigate("/products")}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </>
            )}
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default ConfirmOrder;
