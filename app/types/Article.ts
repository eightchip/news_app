// app/types/Article.ts
export interface Article {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  urlToImage?: string;
  userId: number;
  source: {
    name: string;
  };
  publishedAt: string;
}