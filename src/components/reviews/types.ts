export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  productId: string;
  title: string;
  content: string;
  rating: number;
  pros?: string[];
  cons?: string[];
  helpfulCount: number;
  unhelpfulCount: number;
  verifiedPurchase: boolean;
  createdAt: string;
}
