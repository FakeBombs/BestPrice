
import { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, User, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Review } from './types';

interface ReviewItemProps {
  review: Review;
  onVote: (reviewId: string, isHelpful: boolean) => void;
}

const ReviewItem = ({ review, onVote }: ReviewItemProps) => {
  const [voted, setVoted] = useState<'helpful' | 'unhelpful' | null>(null);
  
  const handleVote = (isHelpful: boolean) => {
    if (voted) return;
    
    onVote(review.id, isHelpful);
    setVoted(isHelpful ? 'helpful' : 'unhelpful');
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('el-GR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="border-b py-6 last:border-0">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {review.userAvatar ? (
            <img 
              src={review.userAvatar} 
              alt={review.userName} 
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex flex-wrap items-start justify-between mb-2">
            <div>
              <h4 className="font-medium">{review.userName}</h4>
              {review.verifiedPurchase && (
                <div className="flex items-center text-green-600 text-xs mt-1">
                  <Check className="h-3 w-3 mr-1" />
                  Επιβεβαιωμένη αγορά
                </div>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {formatDate(review.createdAt)}
            </div>
          </div>
          
          <div className="flex items-center mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star}
                className={`h-4 w-4 ${
                  star <= review.rating 
                    ? 'text-yellow-400 fill-yellow-400' 
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          
          <h3 className="font-medium mb-2">{review.title}</h3>
          <p className="text-sm mb-4">{review.content}</p>
          
          {(review.pros?.length > 0 || review.cons?.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {review.pros?.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-green-600 mb-1">Θετικά</h5>
                  <ul className="text-sm list-disc list-inside">
                    {review.pros.map((pro, index) => (
                      <li key={index}>{pro}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {review.cons?.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-red-600 mb-1">Αρνητικά</h5>
                  <ul className="text-sm list-disc list-inside">
                    {review.cons.map((con, index) => (
                      <li key={index}>{con}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-end mt-4">
            <div className="text-sm text-muted-foreground mr-4">
              Ήταν χρήσιμη αυτή η κριτική;
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className={`mr-2 ${voted === 'helpful' ? 'bg-muted' : ''}`}
              onClick={() => handleVote(true)}
              disabled={voted !== null}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              <span>{review.helpfulCount + (voted === 'helpful' ? 1 : 0)}</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className={voted === 'unhelpful' ? 'bg-muted' : ''}
              onClick={() => handleVote(false)}
              disabled={voted !== null}
            >
              <ThumbsDown className="h-4 w-4 mr-1" />
              <span>{review.unhelpfulCount + (voted === 'unhelpful' ? 1 : 0)}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;
