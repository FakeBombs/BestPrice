import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Review } from './types';
import ReviewItem from './ReviewItem';

interface ReviewsListProps {
  reviews: Review[];
  onVote: (reviewId: string, isHelpful: boolean) => void;
  onWriteReview: () => void;
}

const ReviewsList = ({ reviews, onVote, onWriteReview }: ReviewsListProps) => {
  return (
    <div className="w-full lg:w-2/3">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="mb-4 sm:mb-0">
          <div className="text-xl font-medium">{reviews.length} Κριτικές</div>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2 w-full">
            <Label htmlFor="sort-reviews" className="text-sm whitespace-nowrap">
              Ταξινόμηση:
            </Label>
            <Select defaultValue="newest">
              <SelectTrigger id="sort-reviews" className="w-full">
                <SelectValue placeholder="Επιλέξτε ταξινόμηση" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Πιο πρόσφατες</SelectItem>
                <SelectItem value="highest">Υψηλότερη βαθμολογία</SelectItem>
                <SelectItem value="lowest">Χαμηλότερη βαθμολογία</SelectItem>
                <SelectItem value="helpful">Πιο χρήσιμες</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="border rounded-lg">
        {reviews.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-muted-foreground mb-4">
              Δεν υπάρχουν ακόμα κριτικές για αυτό το προϊόν.
            </p>
            <Button onClick={onWriteReview}>
              Γράψτε την πρώτη κριτική
            </Button>
          </div>
        ) : (
          <div>
            {reviews.map((review) => (
              <ReviewItem 
                key={review.id} 
                review={review} 
                onVote={onVote}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsList;
