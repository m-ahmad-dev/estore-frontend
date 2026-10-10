import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReview } from "../services/reviewApi";
import { myReviewsKeys } from "./useMyReviews";

const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myReviewsKeys.all });
    },
  });
};

export default useCreateReview;
