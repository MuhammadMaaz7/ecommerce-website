import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { adminAPI } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: adminAPI.getStats,
    enabled: user?.role === "admin",
  });

  if (user?.role !== "admin") {
    navigate("/");
    return null;
  }

  const statCards = [
    {
      title: "Total Revenue",
      value: `$${stats?.totalRevenue?.toFixed(2) || "0.00"}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Products",
      value: stats?.totalProducts || 0,
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Orders & Low Stock */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Recent Orders</h2>
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-3">
            {stats?.recentOrders?.map((order: any) => (
              <div
                key={order._id}
                className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg cursor-pointer hover:bg-secondary transition-all"
                onClick={() => navigate(`/admin/orders`)}
              >
                <div>
                  <p className="font-medium">#{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-sm text-muted-foreground">{order.user?.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${order.totalPrice.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Low Stock Products */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Low Stock Alert</h2>
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <div className="space-y-3">
            {stats?.lowStockProducts?.map((product: any) => (
              <div
                key={product._id}
                className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg cursor-pointer hover:bg-destructive/20 transition-all"
                onClick={() => navigate(`/admin/products`)}
              >
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-destructive">{product.stock} left</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
