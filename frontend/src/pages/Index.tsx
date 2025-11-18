import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { SpinWheel } from "@/components/SpinWheel";
import { ChatBox } from "@/components/ChatBox";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useFeaturedProducts } from "@/hooks/useProducts";
import heroBanner from "@/assets/hero-banner.jpg";

const Index = () => {
  const navigate = useNavigate();
  const { data: featuredProducts = [], isLoading: loading } = useFeaturedProducts();

  const aiRecommendations = [
    { title: "Recommended For You", products: featuredProducts.slice(0, 3) },
    { title: "Trending Now", products: featuredProducts.slice(3, 6) },
  ];

  return (
    <div className="min-h-screen gradient-soft">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative h-[600px] flex items-center justify-center"
          >
            <img
              src={heroBanner}
              alt="Shop the latest products"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="max-w-2xl"
              >
                <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-foreground">
                  Shop the Latest
                  <span className="block text-primary">
                    Tech & Lifestyle Products
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  Free shipping on orders over $50. Fast delivery and easy returns.
                </p>
                <div className="flex gap-4">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary-light text-white text-lg px-8 transition-all duration-300"
                    onClick={() => navigate("/products")}
                  >
                    Shop Now
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 border-2 hover:bg-secondary transition-all duration-300"
                    onClick={() => navigate("/products")}
                  >
                    View All Products
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* AI Recommendations */}
        {aiRecommendations.map((section, sectionIndex) => (
          <section key={sectionIndex} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: sectionIndex * 0.2 }}
            >
              <div className="mb-6">
                <h2 className="text-3xl font-bold">{section.title}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.products.map((product: any) => (
                  <ProductCard
                    key={product._id}
                    id={product._id}
                    name={product.name}
                    price={product.price}
                    image={product.image}
                    rating={product.rating}
                    stock={product.stock}
                  />
                ))}
              </div>
            </motion.div>
          </section>
        ))}

        {/* Featured Products */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-8"
          >
            Featured Products
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-3 text-center py-12">
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            ) : featuredProducts.length === 0 ? (
              <div className="col-span-3 text-center py-12">
                <p className="text-muted-foreground">No products available</p>
              </div>
            ) : (
              featuredProducts.map((product: any) => (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  rating={product.rating}
                  stock={product.stock}
                />
              ))
            )}
          </div>
        </section>
      </main>

      <SpinWheel />
      <ChatBox />
    </div>
  );
};

export default Index;
