import { useQuery } from "@tanstack/react-query";
import { productsAPI } from "@/services/api";

export const useProducts = (params?: {
  search?: string;
  category?: string;
  sort?: string;
  page?: number;
}) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productsAPI.getAll(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productsAPI.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ["products", "featured"],
    queryFn: productsAPI.getFeatured,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
