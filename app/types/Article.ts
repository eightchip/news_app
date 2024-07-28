export interface Article {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  urlToImage?: string;
  userId: number;
  source: string; // Changed from object to string
  publishedAt: string;
}