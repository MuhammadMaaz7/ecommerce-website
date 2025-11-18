import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart, Heart, Star, Truck, Shield, RefreshCw, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProduct } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ProductReviews } from "@/components/ProductReviews";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: product, isLoading, error } = useProduct(id!);
  const { addToCart, isAddingToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);

  const inWishlist = isInWishlist(id!);

  const handleAddToCart = () => {
    if (!product || product.stock === 0) {
      return;
    }

    addToCart({ 
      productId: product._id, 
      quantity,
      product: {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        stock: product.stock
      }
    });
  };

  const handleWishlistToggle = () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Login required",
        description: "Please login to add items to your wishlist.",
      });
      return;
    }

    if (inWishlist) {
      removeFromWishlist(id!);
    } else {
      addToWishlist(id!);
    }
  };

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

  if (error || !product) {
    return (
      <div className="min-h-screen gradient-soft">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="p-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
            <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
            <Button onClick={() => navigate("/products")}>Back to Products</Button>
          </Card>
        </main>
      </div>
    );
  }

  const maxQuantity = Math.min(product.stock, 10);

  return (
    <div className="min-h-screen gradient-soft">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6 transition-all hover:translate-x-[-4px]"
        >
          ← Back to Products
        </Button>

        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="bg-card rounded-2xl overflow-hidden shadow-lg border border-border">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-[500px] object-cover"
              />
            </div>
            {product.images && product.images.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img: string, i: number) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="bg-card rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-primary transition-all"
                  >
                    <img src={img} alt={`View ${i + 1}`} className="w-full h-24 object-cover" />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating) 
                          ? "fill-yellow-400 text-yellow-400" 
                          : "text-gray-300"
                      }`} 
                    />
                  ))}
                </div>
                <span className="text-muted-foreground">
                  ({product.numReviews} reviews)
                </span>
              </div>
              <p className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {product.stock > 0 ? (
                  <span className="text-green-600">In Stock ({product.stock} available)</span>
                ) : (
                  <span className="text-destructive">Out of Stock</span>
                )}
              </p>
            </div>

            <Card className="p-4 border border-border">
              <p className="text-foreground leading-relaxed">
                {product.description}
              </p>
            </Card>

            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Category: <span className="font-medium text-foreground">{product.category}</span>
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="transition-all"
                >
                  -
                </Button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                  disabled={quantity >= maxQuantity}
                  className="transition-all"
                >
                  +
                </Button>
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                size="lg" 
                className="flex-1 bg-primary hover:bg-primary-light text-white transition-all duration-300"
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAddingToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.stock === 0 
                  ? "Out of Stock" 
                  : isAddingToCart 
                  ? "Adding..." 
                  : "Add to Cart"}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className={`transition-all ${
                  inWishlist 
                    ? "bg-red-500 text-white hover:bg-red-600 border-red-500" 
                    : "hover:border-accent hover:text-accent"
                }`}
                onClick={handleWishlistToggle}
              >
                <Heart className={`h-5 w-5 ${inWishlist ? "fill-current" : ""}`} />
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6">
              <Card className="p-4 text-center hover:shadow-lg transition-all cursor-pointer">
                <Truck className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Free Shipping</p>
              </Card>
              <Card className="p-4 text-center hover:shadow-lg transition-all cursor-pointer">
                <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">2 Year Warranty</p>
              </Card>
              <Card className="p-4 text-center hover:shadow-lg transition-all cursor-pointer">
                <RefreshCw className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">30-Day Returns</p>
              </Card>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <ProductReviews 
            productId={product._id} 
            reviews={product.reviews || []} 
          />
        </motion.div>
      </main>
    </div>
  );
};

export default ProductDetail;
