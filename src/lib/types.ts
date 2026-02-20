export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  inStock: boolean;
  rating: number;
  features?: string[];
  specs?: Record<string, string>;
}

export interface CartItem extends Product {
  quantity: number;
}
