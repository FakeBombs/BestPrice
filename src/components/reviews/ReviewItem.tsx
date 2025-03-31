
import { Star, ThumbsUp, ThumbsDown, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Review } from './types';

interface ReviewItemProps {
  review: Review;
  onVote: (reviewId: string, isHelpful: boolean) => void;
}

const ReviewItem = ({ review, onVote }: ReviewItemProps) => {
  return (
    <div className="border rounded-lg p-4">
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
          onClick={() => onVote(review.id, true)}
        >
          <ThumbsUp className="h-3 w-3 mr-1" />
          Helpful ({review.helpful})
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center ml-2"
          onClick={() => onVote(review.id, false)}
        >
          <ThumbsDown className="h-3 w-3 mr-1" />
          Not Helpful ({review.notHelpful})
        </Button>
      </div>
    </div>
  );
};

export default ReviewItem;
