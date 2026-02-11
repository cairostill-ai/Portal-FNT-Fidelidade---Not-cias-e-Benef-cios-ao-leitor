
export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: Category;
  imageUrl: string;
  date: string;
  author: string;
  sourceUrl?: string;
  isHeadline?: boolean;
}

export enum Category {
  FRANCA = 'Franca',
  REGIAO = 'Região',
  POLITICA = 'Política',
  ESPORTES = 'Esportes',
  CULTURA = 'Cultura',
  POLICIA = 'Polícia',
  COLUNISTAS = 'Colunistas'
}

export interface Columnist {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatarUrl: string;
}

export interface Coupon {
  id: string;
  partnerName: string;
  description: string;
  discount: string;
  code: string;
  imageUrl: string;
  link?: string;
}

export interface Ad {
  id: string;
  title: string;
  imageUrl: string;
  link: string;
  type: 'banner' | 'card';
}
