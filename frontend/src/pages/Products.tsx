import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Filter, SlidersHorizontal, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";

const categories = ["All", "Electronics", "Fashion", "Accessories", "Sports", "Home & Living"];
const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Newest", value: "newest" },
];

const Products = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSort, setSelectedSort] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const query = searchParams.get("search");
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  const { data, isLoading, error, refetch } = useProducts({
    search: searchQuery || undefined,
    category: selectedCategory !== "All" ? selectedCategory : undefined,
    sort: selectedSort,
  });

  const products = data?.products || [];

  return (
    <div className="min-h-screen gradient-soft">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 text-foreground">
            {searchQuery ? `Search Results for "${searchQuery}"` : "All Products"}
          </h1>
          <p className="text-muted-foreground">
            {searchQuery 
              ? `Found ${products.length} products` 
              : "Explore our curated collection of premium items"}
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-64 space-y-6"
          >
            <div className="bg-card rounded-xl p-6 shadow-md border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-5 w-5 text-primary" />
                <h2 className="font-semibold text-lg">Categories</h2>
              </div>
              <div className="space-y-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "ghost"}
                    className="w-full justify-start transition-smooth"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-md border border-border">
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal className="h-5 w-5 text-primary" />
                <h2 className="font-semibold text-lg">Sort By</h2>
              </div>
              <div className="space-y-2">
                {sortOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={selectedSort === option.value ? "default" : "ghost"}
                    className="w-full justify-start transition-smooth"
                    onClick={() => setSelectedSort(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </motion.aside>

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-destructive">{(error as any).message || "Failed to load products"}</p>
                <Button onClick={() => refetch()} className="mt-4">
                  Try Again
                </Button>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found</p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {products.map((product: any, index: number) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProductCard 
                      id={product._id}
                      name={product.name}
                      price={product.price}
                      image={product.image}
                      rating={product.rating}
                      stock={product.stock}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Products;
