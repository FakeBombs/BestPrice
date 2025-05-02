
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

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
  const totalRatings = ratingCounts.reduce((a, b) => a + b, 0);
  
  const getRatingPercentage = (count: number) => {
    if (totalRatings === 0) return 0;
    return (count / totalRatings) * 100;
  };
  
  return (
    <div className="w-full lg:w-1/3 p-4 border rounded-lg">
      <div className="text-center mb-4">
        <div className="text-4xl font-bold mb-1">{rating.toFixed(1)}</div>
        <div className="flex justify-center mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star 
              key={star}
              className={`h-5 w-5 ${
                star <= Math.round(rating) 
                  ? 'text-yellow-400 fill-yellow-400' 
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <div className="text-sm text-muted-foreground">
          Βασισμένο σε {reviewCount} κριτικές
        </div>
      </div>
      
      <div className="space-y-2 mb-6">
        {[5, 4, 3, 2, 1].map((starRating) => (
          <div key={starRating} className="flex items-center">
            <div className="w-10 text-sm">{starRating} ★</div>
            <div className="flex-1 h-2 mx-2 bg-gray-200 rounded">
              <div 
                className="h-2 bg-yellow-400 rounded"
                style={{ width: `${getRatingPercentage(ratingCounts[starRating - 1])}%` }}
              />
            </div>
            <div className="w-10 text-right text-sm text-muted-foreground">
              {ratingCounts[starRating - 1]}
            </div>
          </div>
        ))}
      </div>
      
      <Button onClick={onWriteReview} className="w-full">
        Γράψτε μια κριτική
      </Button>
    </div>
  );
};

export default ReviewRatingSummary;
