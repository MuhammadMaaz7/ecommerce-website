import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Search, Eye } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const Orders = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: adminAPI.getAllOrders,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, trackingNumber }: any) =>
      adminAPI.updateOrderStatus(id, status, trackingNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      toast({ title: "Order status updated successfully" });
      setSelectedOrder(null);
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Failed to update order", description: error.message });
    },
  });

  const handleStatusUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateStatusMutation.mutate({
      id: selectedOrder._id,
      status: formData.get("status"),
      trackingNumber: formData.get("trackingNumber") || undefined,
    });
  };

  const filteredOrders = orders?.filter((order: any) =>
    order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.user?.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const statusColors: any = {
    Pending: "bg-yellow-500/20 text-yellow-700",
    Processing: "bg-blue-500/20 text-blue-700",
    Shipped: "bg-purple-500/20 text-purple-700",
    Delivered: "bg-green-500/20 text-green-700",
    Cancelled: "bg-red-500/20 text-red-700",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders Management</h1>
        <p className="text-muted-foreground">Manage and track all orders</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by order ID or customer name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card className="p-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Order ID</th>
                  <th className="text-left p-4">Customer</th>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Total</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order: any) => (
                  <tr key={order._id} className="border-b hover:bg-secondary/50">
                    <td className="p-4 font-mono text-sm">#{order._id.slice(-8).toUpperCase()}</td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{order.user?.name}</p>
                        <p className="text-sm text-muted-foreground">{order.user?.email}</p>
                      </div>
                    </td>
                    <td className="p-4 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-semibold">${order.totalPrice.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end">
                        <Button size="sm" variant="outline" onClick={() => setSelectedOrder(order)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold mb-6">Order Details</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="font-mono">#{selectedOrder._id.slice(-8).toUpperCase()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Customer</p>
                <p className="font-medium">{selectedOrder.user?.name}</p>
                <p className="text-sm">{selectedOrder.user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Shipping Address</p>
                <p>{selectedOrder.shippingAddress.address}</p>
                <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p>
                <p>{selectedOrder.shippingAddress.country}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Items</p>
                {selectedOrder.orderItems.map((item: any) => (
                  <div key={item._id} className="flex justify-between py-2">
                    <span>{item.name} x {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleStatusUpdate} className="space-y-4">
              <div>
                <Label htmlFor="status">Update Status</Label>
                <select
                  id="status"
                  name="status"
                  defaultValue={selectedOrder.status}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <Label htmlFor="trackingNumber">Tracking Number (Optional)</Label>
                <Input
                  id="trackingNumber"
                  name="trackingNumber"
                  defaultValue={selectedOrder.trackingNumber}
                  placeholder="Enter tracking number"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={updateStatusMutation.isPending}>
                  {updateStatusMutation.isPending ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</>
                  ) : (
                    "Update Order"
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => setSelectedOrder(null)}>
                  Close
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Orders;
