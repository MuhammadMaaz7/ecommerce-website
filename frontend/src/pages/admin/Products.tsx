import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Loader2, Search } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsAPI, adminAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const Products = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => productsAPI.getAll({}),
  });

  const createMutation = useMutation({
    mutationFn: adminAPI.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Product created successfully" });
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Failed to create product", description: error.message });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => adminAPI.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Product updated successfully" });
      setIsModalOpen(false);
      setEditingProduct(null);
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Failed to update product", description: error.message });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminAPI.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Product deleted successfully" });
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Failed to delete product", description: error.message });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      description: formData.get("description"),
      price: Number(formData.get("price")),
      category: formData.get("category"),
      image: formData.get("image"),
      stock: Number(formData.get("stock")),
      featured: formData.get("featured") === "on",
    };

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const products = productsData?.products || [];
  const filteredProducts = products.filter((p: any) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products Management</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <Button onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Products Table */}
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
                  <th className="text-left p-4">Product</th>
                  <th className="text-left p-4">Category</th>
                  <th className="text-left p-4">Price</th>
                  <th className="text-left p-4">Stock</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product: any) => (
                  <tr key={product._id} className="border-b hover:bg-secondary/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product._id.slice(-8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{product.category}</td>
                    <td className="p-4">${product.price.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={product.stock < 10 ? "text-destructive font-semibold" : ""}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="p-4">
                      {product.featured && (
                        <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded">Featured</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => { setEditingProduct(product); setIsModalOpen(true); }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this product?")) {
                              deleteMutation.mutate(product._id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold mb-6">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" name="name" defaultValue={editingProduct?.name} required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" defaultValue={editingProduct?.description} required rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" name="price" type="number" step="0.01" defaultValue={editingProduct?.price} required />
                </div>
                <div>
                  <Label htmlFor="stock">Stock</Label>
                  <Input id="stock" name="stock" type="number" defaultValue={editingProduct?.stock} required />
                </div>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  name="category"
                  defaultValue={editingProduct?.category}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Sports">Sports</option>
                  <option value="Home & Living">Home & Living</option>
                </select>
              </div>
              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input id="image" name="image" defaultValue={editingProduct?.image} required />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="featured" name="featured" defaultChecked={editingProduct?.featured} />
                <Label htmlFor="featured">Featured Product</Label>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {(createMutation.isPending || updateMutation.isPending) ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                  ) : (
                    editingProduct ? "Update Product" : "Create Product"
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setIsModalOpen(false); setEditingProduct(null); }}>
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Products;
