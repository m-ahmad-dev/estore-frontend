import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateReview } from "../services/reviewApi";
import { myReviewsKeys } from "./useMyReviews";

const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myReviewsKeys.all });
    },
  });
};

export default useUpdateReview;
