
import ReviewItem from './ReviewItem';
import { Button } from '@/components/ui/button';
import { Review } from './types';

interface ReviewsListProps {
  reviews: Review[];
  onVote: (reviewId: string, isHelpful: boolean) => void;
  onWriteReview: () => void;
}

const ReviewsList = ({ reviews, onVote, onWriteReview }: ReviewsListProps) => {
  return (
    <div className="w-full lg:w-2/3">
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <ReviewItem key={review.id} review={review} onVote={onVote} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground mb-4">No reviews yet. Be the first to review this product!</p>
          <Button onClick={onWriteReview}>Write a Review</Button>
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
