import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartAPI } from "@/services/api";
import { useToast } from "./use-toast";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

// Guest cart helpers
const GUEST_CART_KEY = "guestCart";

const getGuestCart = () => {
  const cart = localStorage.getItem(GUEST_CART_KEY);
  return cart ? JSON.parse(cart) : { items: [], totalPrice: 0 };
};

const saveGuestCart = (cart: any) => {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
  return cart;
};

export const useCart = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  // Get cart (server-side for logged in users, localStorage for guests)
  const { data: serverCart, isLoading: serverLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: cartAPI.get,
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });

  // Guest cart query (uses localStorage)
  const { data: guestCart, isLoading: guestLoading } = useQuery({
    queryKey: ["guestCart"],
    queryFn: getGuestCart,
    enabled: !user,
    staleTime: Infinity, // Never auto-refetch
  });

  // Listen for cart merge event
  useEffect(() => {
    const handleCartMerged = () => {
      // Invalidate cart queries when merge happens
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["guestCart"] });
    };

    window.addEventListener("cartMerged", handleCartMerged);
    return () => window.removeEventListener("cartMerged", handleCartMerged);
  }, [queryClient]);

  // Use server cart for logged in users, guest cart for others
  const cart = user ? serverCart : guestCart;
  const isLoading = user ? serverLoading : guestLoading;

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity, product }: { productId: string; quantity: number; product?: any }) => {
      if (user) {
        return cartAPI.add(productId, quantity);
      } else {
        // Guest cart - update localStorage
        const currentCart = getGuestCart();
        const existingItemIndex = currentCart.items.findIndex((item: any) => item.product._id === productId);
        
        if (existingItemIndex > -1) {
          currentCart.items[existingItemIndex].quantity += quantity;
        } else {
          currentCart.items.push({
            product: product || { _id: productId },
            quantity,
            price: product?.price || 0,
          });
        }
        
        currentCart.totalPrice = currentCart.items.reduce(
          (total: number, item: any) => total + item.price * item.quantity,
          0
        );
        
        return saveGuestCart(currentCart);
      }
    },
    onSuccess: () => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["guestCart"] });
      }
      toast({
        title: "Added to cart",
        description: "Product has been added to your cart.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to add to cart",
        description: error.message || "Please try again.",
      });
    },
  });

  // Update cart item mutation
  const updateCartMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      if (user) {
        return cartAPI.update(productId, quantity);
      } else {
        const currentCart = getGuestCart();
        const itemIndex = currentCart.items.findIndex((item: any) => item.product._id === productId);
        
        if (itemIndex > -1) {
          currentCart.items[itemIndex].quantity = quantity;
          currentCart.totalPrice = currentCart.items.reduce(
            (total: number, item: any) => total + item.price * item.quantity,
            0
          );
          return saveGuestCart(currentCart);
        }
        return currentCart;
      }
    },
    onSuccess: () => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["guestCart"] });
      }
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to update cart",
        description: error.message || "Please try again.",
      });
    },
  });

  // Remove from cart mutation
  const removeFromCartMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (user) {
        return cartAPI.remove(productId);
      } else {
        const currentCart = getGuestCart();
        currentCart.items = currentCart.items.filter((item: any) => item.product._id !== productId);
        currentCart.totalPrice = currentCart.items.reduce(
          (total: number, item: any) => total + item.price * item.quantity,
          0
        );
        return saveGuestCart(currentCart);
      }
    },
    onSuccess: () => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["guestCart"] });
      }
      toast({
        title: "Removed from cart",
        description: "Product has been removed from your cart.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to remove from cart",
        description: error.message || "Please try again.",
      });
    },
  });

  // Clear cart mutation
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      if (user) {
        return cartAPI.clear();
      } else {
        const emptyCart = { items: [], totalPrice: 0 };
        return saveGuestCart(emptyCart);
      }
    },
    onSuccess: () => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["guestCart"] });
      }
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart.",
      });
    },
  });

  const cartCount = cart?.items?.reduce((total: number, item: any) => total + item.quantity, 0) || 0;
  const cartTotal = cart?.totalPrice || 0;

  return {
    cart,
    isLoading,
    cartCount,
    cartTotal,
    addToCart: addToCartMutation.mutate,
    updateCart: updateCartMutation.mutate,
    removeFromCart: removeFromCartMutation.mutate,
    clearCart: clearCartMutation.mutate,
    isAddingToCart: addToCartMutation.isPending,
  };
};
