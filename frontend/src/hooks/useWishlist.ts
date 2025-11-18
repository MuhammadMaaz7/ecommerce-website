import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wishlistAPI } from "@/services/api";
import { useToast } from "./use-toast";
import { useAuth } from "@/context/AuthContext";

export const useWishlist = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  // Get wishlist
  const { data: wishlist, isLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: wishlistAPI.get,
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });

  // Add to wishlist mutation
  const addToWishlistMutation = useMutation({
    mutationFn: (productId: string) => wishlistAPI.add(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast({
        title: "Added to wishlist",
        description: "Product has been added to your wishlist.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to add to wishlist",
        description: error.message || "Please try again.",
      });
    },
  });

  // Remove from wishlist mutation
  const removeFromWishlistMutation = useMutation({
    mutationFn: (productId: string) => wishlistAPI.remove(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast({
        title: "Removed from wishlist",
        description: "Product has been removed from your wishlist.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to remove from wishlist",
        description: error.message || "Please try again.",
      });
    },
  });

  // Clear wishlist mutation
  const clearWishlistMutation = useMutation({
    mutationFn: wishlistAPI.clear,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast({
        title: "Wishlist cleared",
        description: "All items have been removed from your wishlist.",
      });
    },
  });

  const isInWishlist = (productId: string) => {
    return wishlist?.products?.some((p: any) => p._id === productId) || false;
  };

  return {
    wishlist,
    isLoading,
    addToWishlist: addToWishlistMutation.mutate,
    removeFromWishlist: removeFromWishlistMutation.mutate,
    clearWishlist: clearWishlistMutation.mutate,
    isInWishlist,
    isAddingToWishlist: addToWishlistMutation.isPending,
    isRemovingFromWishlist: removeFromWishlistMutation.isPending,
  };
};
