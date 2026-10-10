import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReview } from "../services/reviewApi";
import { myReviewsKeys } from "./useMyReviews";

const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myReviewsKeys.all });
    },
  });
};

export default useDeleteReview;
