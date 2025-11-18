import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersAPI } from "@/services/api";
import { useToast } from "./use-toast";
import { useAuth } from "@/context/AuthContext";

export const useOrders = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["orders"],
    queryFn: ordersAPI.getMyOrders,
    enabled: !!user,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useOrder = (id: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["order", id],
    queryFn: () => ordersAPI.getById(id),
    enabled: !!user && !!id,
    staleTime: 1000 * 60 * 2,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ordersAPI.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      // Don't show toast here, let the component handle it
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to create order",
        description: error.message || "Please try again.",
      });
    },
  });
};
