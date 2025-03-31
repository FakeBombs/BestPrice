
import { Review } from './types';

// Mock reviews data
export const mockReviews: Review[] = [
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
