import { Search, ShoppingCart, User, LogOut, Package } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AuthModal } from "./AuthModal";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { toast } = useToast();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "Successfully logged out. See you soon!",
    });
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <motion.h1
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate(user?.role === "admin" ? "/admin" : "/")}
              className="text-2xl font-bold text-primary cursor-pointer"
            >
              ShopVerse
            </motion.h1>
            
            <div className="hidden md:flex gap-6">
              <Button
                variant="ghost"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => navigate("/products")}
              >
                Products
              </Button>
              <Button
                variant="ghost"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => navigate("/contact")}
              >
                Contact
              </Button>
            </div>
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
                  }
                }}
                className="pl-10 bg-secondary/50 border-border focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative transition-smooth hover:scale-110"
              onClick={() => navigate("/cart")}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-glow">
                  {cartCount}
                </span>
              )}
            </Button>
            {user ? (
              <div className="relative">
                <Button 
                  variant="ghost"
                  className="flex items-center gap-2 transition-all hover:bg-secondary"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium hidden md:block">
                    {user.name}
                  </span>
                </Button>
                
                {isProfileMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsProfileMenuOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden"
                    >
                      <div className="p-2">
                        <button
                          onClick={() => {
                            navigate("/profile");
                            setIsProfileMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-secondary rounded-md transition-all flex items-center gap-2"
                        >
                          <User className="h-4 w-4" />
                          My Profile
                        </button>
                        <button
                          onClick={() => {
                            navigate("/profile");
                            setIsProfileMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-secondary rounded-md transition-all flex items-center gap-2"
                        >
                          <Package className="h-4 w-4" />
                          My Orders
                        </button>
                        {user.role === "admin" && (
                          <>
                            <div className="border-t border-border my-2" />
                            <button
                              onClick={() => {
                                navigate("/admin");
                                setIsProfileMenuOpen(false);
                              }}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-primary/10 text-primary rounded-md transition-all flex items-center gap-2 font-medium"
                            >
                              <ShoppingCart className="h-4 w-4" />
                              Admin Panel
                            </button>
                          </>
                        )}
                        <div className="border-t border-border my-2" />
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsProfileMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-destructive/10 text-destructive rounded-md transition-all flex items-center gap-2"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </div>
            ) : (
              <Button 
                variant="ghost" 
                size="icon"
                className="transition-smooth hover:scale-110"
                onClick={() => setIsAuthModalOpen(true)}
              >
                <User className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </motion.nav>
  );
};
