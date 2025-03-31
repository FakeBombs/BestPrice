
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Star } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface ReviewRatingSummaryProps {
  rating: number;
  reviewCount: number;
  ratingCounts: number[];
  onWriteReview: () => void;
}

const ReviewRatingSummary = ({ 
  rating, 
  reviewCount, 
  ratingCounts, 
  onWriteReview 
}: ReviewRatingSummaryProps) => {
  return (
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
          onClick={onWriteReview}
        >
          Write a Review
        </Button>
      </div>
    </div>
  );
};

export default ReviewRatingSummary;
