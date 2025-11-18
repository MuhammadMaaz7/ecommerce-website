import { Star, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { productsAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: string;
}

interface ProductReviewsProps {
  productId: string;
  reviews?: Review[];
}

export const ProductReviews = ({ productId, reviews = [] }: ProductReviewsProps) => {
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if user can review this product
  const { data: canReviewData } = useQuery({
    queryKey: ["canReview", productId],
    queryFn: () => productsAPI.canReview(productId),
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });

  const addReviewMutation = useMutation({
    mutationFn: (reviewData: { rating: number; comment: string }) =>
      productsAPI.addReview(productId, reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      toast({
        title: "Review submitted",
        description: "Thank you for your review!",
      });
      setShowReviewForm(false);
      setNewReview({ rating: 5, comment: "" });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to submit review",
        description: error.message || "Please try again.",
      });
    },
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Login required",
        description: "Please login to submit a review.",
      });
      return;
    }

    if (!newReview.comment.trim()) {
      toast({
        variant: "destructive",
        title: "Review required",
        description: "Please write a review comment.",
      });
      return;
    }

    addReviewMutation.mutate(newReview);
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Customer Reviews</h3>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= averageRating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {averageRating.toFixed(1)} out of 5 ({reviews.length} reviews)
            </span>
          </div>
        </div>
        <Button 
          onClick={() => {
            if (!user) {
              toast({
                variant: "destructive",
                title: "Login required",
                description: "Please login to write a review.",
              });
              return;
            }
            
            if (canReviewData && !canReviewData.canReview) {
              toast({
                variant: "destructive",
                title: "Cannot review",
                description: canReviewData.reason || "You cannot review this product.",
              });
              return;
            }
            
            setShowReviewForm(!showReviewForm);
          }}
          disabled={user && canReviewData && !canReviewData.canReview}
        >
          Write a Review
        </Button>
      </div>

      {user && canReviewData && !canReviewData.canReview && (
        <div className="bg-muted/50 border border-border rounded-lg p-4 text-sm text-muted-foreground">
          <p>💡 {canReviewData.reason}</p>
        </div>
      )}

      {showReviewForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={handleSubmitReview}
          className="bg-secondary/50 p-4 rounded-lg space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-2">Your Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                >
                  <Star
                    className={`h-6 w-6 cursor-pointer transition-colors ${
                      star <= newReview.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 hover:text-yellow-200"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Your Review</label>
            <Textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              placeholder="Share your experience with this product..."
              rows={4}
              required
            />
          </div>
          <div className="flex gap-2">
            <Button 
              type="submit" 
              className="bg-primary text-white"
              disabled={addReviewMutation.isPending}
            >
              {addReviewMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowReviewForm(false)}
              disabled={addReviewMutation.isPending}
            >
              Cancel
            </Button>
          </div>
        </motion.form>
      )}

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No reviews yet. Be the first to review this product!
          </p>
        ) : (
          reviews.map((review) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold">{review.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-foreground">{review.comment}</p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
