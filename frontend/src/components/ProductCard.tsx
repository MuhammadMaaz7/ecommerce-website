import { motion } from "framer-motion";
import { ShoppingCart, Heart } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  stock: number;
}

export const ProductCard = ({ id, name, price, image, rating, stock }: ProductCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { addToCart, isAddingToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const inWishlist = isInWishlist(id);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (stock === 0) {
      return;
    }

    addToCart({ 
      productId: id, 
      quantity: 1,
      product: { _id: id, name, price, image, stock }
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Login required",
        description: "Please login to add items to your wishlist.",
      });
      return;
    }

    if (inWishlist) {
      removeFromWishlist(id);
    } else {
      addToWishlist(id);
    }
  };
  
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-all duration-300 cursor-pointer border border-border"
        onClick={() => navigate(`/product/${id}`)}
      >
        <div className="relative overflow-hidden group">
          <img
            src={image}
            alt={name}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleWishlistToggle}
            className={`absolute top-4 right-4 backdrop-blur-sm p-2 rounded-full shadow-lg md:opacity-0 md:group-hover:opacity-100 transition-all ${
              inWishlist 
                ? "bg-red-500 text-white opacity-100" 
                : "bg-card/90 text-accent"
            }`}
          >
            <Heart className={`h-5 w-5 ${inWishlist ? "fill-current" : ""}`} />
          </motion.button>
          
          {stock === 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Out of Stock</span>
            </div>
          )}
        </div>

        <div className="p-6 flex-1 flex flex-col">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{name}</h3>
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <span 
                key={i}
                className={`text-lg ${i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}`}
              >
                ★
              </span>
            ))}
            <span className="text-sm text-muted-foreground ml-2">({rating.toFixed(1)})</span>
          </div>
          <div className="mt-auto">
            <p className="text-2xl font-bold text-primary mb-4">${price.toFixed(2)}</p>
            <Button 
              className="w-full bg-primary hover:bg-primary-light text-white transition-all duration-300"
              onClick={handleAddToCart}
              disabled={stock === 0 || isAddingToCart}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {stock === 0 ? "Out of Stock" : isAddingToCart ? "Adding..." : "Add to Cart"}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
