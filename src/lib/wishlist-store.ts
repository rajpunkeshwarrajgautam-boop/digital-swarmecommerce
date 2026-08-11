import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from './types';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  clearWishlist: () => void;
  isWishlisted: (id: string) => boolean;
  syncWithCatalog: (products: Product[]) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const exists = get().items.find((i) => i.id === item.id);
        if (!exists) {
          set({ items: [...get().items, item] });
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },
      clearWishlist: () => set({ items: [] }),
      isWishlisted: (id) => get().items.some((i) => i.id === id),
      syncWithCatalog: (products) => {
        const catalog = new Map(products.map((product) => [product.id, product]));
        set({
          items: get().items.flatMap((item) => {
            const product = catalog.get(item.id);
            if (!product) return [];
            return [{ id: product.id, name: product.name, price: product.price, image: product.image }];
          }),
        });
      },
    }),
    {
      name: 'wishlist-storage',
    },
  ),
);
