import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem } from './types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  toggleCart: () => void;
  addBundle: (products: Product[], discountPercentage: number) => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      total: 0,

      addItem: (product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.productId === product.id);

        if (existingItem) {
          const updatedItems = currentItems.map((item) =>
            item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
          set({ items: updatedItems });
        } else {
          const newItem: CartItem = {
            productId: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            quantity: 1,
            image: product.image,
            category: product.category,
          };
          set({ items: [...currentItems, newItem] });
        }
        set({ isOpen: true });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          const updatedItems = state.items.map((item) =>
            item.productId === productId ? { ...item, quantity: Math.max(0, quantity) } : item
          );
          return { items: updatedItems.filter((item) => item.quantity > 0) };
        });
      },

      clearCart: () => set({ items: [] }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addBundle: (products, discountPercentage) => {
        const currentItems = get().items;
        const discountScale = (100 - discountPercentage) / 100;

        const bundleItems: CartItem[] = products.map((p) => ({
          productId: p.id,
          name: p.name,
          price: Math.round(p.price * discountScale),
          originalPrice: p.price,
          quantity: 1,
          image: p.image,
          category: p.category,
        }));

        set({ items: [...currentItems, ...bundleItems], isOpen: true });
      },

      getCartTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getCartCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'digitalswarm-cart-storage',
    }
  )
);
