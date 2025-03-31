
import { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface UserReviewsProps {
  productId: string;
  rating: number;
  reviewCount: number;
}

interface Review {
  id: string;
  userName: string;
  date: string;
  rating: number;
  title: string;
  comment: string;
  helpful: number;
  notHelpful: number;
}

// Mock reviews data
const mockReviews: Review[] = [
  {
    id: '1',
    userName: 'John Smith',
    date: '2023-10-15',
    rating: 5,
    title: 'Excellent product, highly recommended!',
    comment: 'This is an amazing product. The quality is outstanding and it works perfectly. I would definitely recommend it to anyone looking for a reliable device.',
    helpful: 24,
    notHelpful: 2
  },
  {
    id: '2',
    userName: 'Emily Johnson',
    date: '2023-09-28',
    rating: 4,
    title: 'Good value for money',
    comment: 'Overall a solid product. There are a few minor issues but nothing that would prevent me from recommending it. Good battery life and performance.',
    helpful: 18,
    notHelpful: 3
  },
  {
    id: '3',
    userName: 'Michael Chen',
    date: '2023-08-12',
    rating: 3,
    title: 'Decent but has room for improvement',
    comment: 'The product is okay but there are some areas that could be improved. The interface is a bit confusing and the setup took longer than expected.',
    helpful: 12,
    notHelpful: 5
  }
];

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
        {/* Rating Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="text-4xl font-bold mr-4">{rating.toFixed(1)}</div>
              <div>
                <div className="flex items-center text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${i < Math.round(rating) ? 'fill-current' : ''}`} 
                    />
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">Based on {reviewCount} reviews</div>
              </div>
            </div>
            
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = ratingCounts[stars - 1];
                const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
                
                return (
                  <div key={stars} className="flex items-center gap-2">
                    <div className="text-sm w-12">
                      {stars} {stars === 1 ? 'star' : 'stars'}
                    </div>
                    <Progress value={percentage} className="h-2" />
                    <div className="text-sm w-10 text-right">{count}</div>
                  </div>
                );
              })}
            </div>
            
            <Button 
              className="w-full mt-4"
              onClick={handleWriteReview}
            >
              Write a Review
            </Button>
          </div>
        </div>
        
        {/* Reviews List */}
        <div className="w-full lg:w-2/3">
          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mr-3">
                        <User className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="font-medium">{review.userName}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(review.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center text-yellow-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < review.rating ? 'fill-current' : ''}`} 
                        />
                      ))}
                    </div>
                  </div>
                  
                  <h4 className="font-medium mt-3">{review.title}</h4>
                  <p className="mt-2 text-sm">{review.comment}</p>
                  
                  <div className="flex items-center mt-4 text-sm">
                    <div className="mr-4">Was this review helpful?</div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center"
                      onClick={() => handleVote(review.id, true)}
                    >
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      Helpful ({review.helpful})
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center ml-2"
                      onClick={() => handleVote(review.id, false)}
                    >
                      <ThumbsDown className="h-3 w-3 mr-1" />
                      Not Helpful ({review.notHelpful})
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <p className="text-muted-foreground mb-4">No reviews yet. Be the first to review this product!</p>
              <Button onClick={handleWriteReview}>Write a Review</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserReviews;
