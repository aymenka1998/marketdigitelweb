export interface Template {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  category: string;
  image: string;
  images: string[];
  features: string[];
  longFeatures: { title: string; desc: string; icon: string }[];
  isNew?: boolean;
  isBestSeller?: boolean;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
}

export interface CartItem {
  template: Template;
  quantity: number;
}

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  items: { templateId: string; title: string; price: number }[];
  total: number;
  paymentStatus: string;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
}
