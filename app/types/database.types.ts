import { Article } from '../types/Article';

export interface Database {
  public: {
    Tables: {
      articles: {
        Row: Article;
        Insert: Omit<Article, 'id'>;
        Update: Partial<Omit<Article, 'id'>>;
      };
    };
  };
}