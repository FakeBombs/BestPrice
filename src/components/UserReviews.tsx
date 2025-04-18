
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import ReviewRatingSummary from './reviews/ReviewRatingSummary';
import ReviewsList from './reviews/ReviewsList';
import { Review } from './reviews/types';
import { mockReviews } from './reviews/mockData';

interface UserReviewsProps {
  productId: number;
  rating: number;
  reviewCount: number;
}

const UserReviews = ({ productId, rating, reviewCount }: UserReviewsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviews] = useState<Review[]>(mockReviews);
  
  // Calculate rating distribution
  const ratingCounts = Array(5).fill(0);
  reviews.forEach(review => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingCounts[review.rating - 1]++;
    }
  });
  
  const handleVote = (reviewId: string, isHelpful: boolean) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to vote on reviews",
      });
      return;
    }
    
    toast({
      title: "Vote Recorded",
      description: `You found this review ${isHelpful ? 'helpful' : 'not helpful'}`,
    });
  };
  
  const handleWriteReview = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to write a review",
      });
      return;
    }
    
    toast({
      title: "Feature Coming Soon",
      description: "The review form will be available soon",
    });
  };
  
  return (
    <div>
      <h3 className="text-xl font-medium mb-4">Customer Reviews</h3>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <ReviewRatingSummary 
          rating={rating}
          reviewCount={reviewCount}
          ratingCounts={ratingCounts}
          onWriteReview={handleWriteReview}
        />
        
        <ReviewsList 
          reviews={reviews}
          onVote={handleVote}
          onWriteReview={handleWriteReview}
        />
      </div>
    </div>
  );
};

export default UserReviews;
