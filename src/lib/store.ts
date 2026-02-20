import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem } from './types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  isOpen: boolean;
  toggleCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      total: 0,

      addItem: (product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === product.id);

        if (existingItem) {
          const updatedItems = currentItems.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
          set({ items: updatedItems, total: calculateTotal(updatedItems) });
        } else {
          const updatedItems = [...currentItems, { ...product, quantity: 1 }];
          set({ items: updatedItems, total: calculateTotal(updatedItems) });
        }
        // Auto open cart on add
        set({ isOpen: true });
      },

      removeItem: (productId) => {
        const updatedItems = get().items.filter((item) => item.id !== productId);
        set({ items: updatedItems, total: calculateTotal(updatedItems) });
      },

      updateQuantity: (productId, quantity) => {
        const updatedItems = get().items.map((item) =>
          item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item
        );
        // Remove if 0
        const finalItems = updatedItems.filter((item) => item.quantity > 0);
        set({ items: finalItems, total: calculateTotal(finalItems) });
      },

      clearCart: () => set({ items: [], total: 0 }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: 'digitalswarm-cart-storage',
    }
  )
);

function calculateTotal(items: CartItem[]) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}
