import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem } from './types';

const MAX_QUANTITY = 10;

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  toggleCart: () => void;
  addBundle: (products: Product[], discountPercentage: number) => void;
  syncWithCatalog: (products: Product[]) => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

function fromProduct(product: Product, quantity = 1, price = product.price): CartItem {
  return {
    productId: product.id,
    name: product.name,
    price,
    originalPrice: product.originalPrice,
    quantity: Math.min(MAX_QUANTITY, Math.max(1, quantity)),
    image: product.image,
    category: product.category,
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.productId === product.id);

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.productId === product.id
                ? { ...item, ...fromProduct(product, Math.min(MAX_QUANTITY, item.quantity + 1)) }
                : item,
            ),
            isOpen: true,
          });
          return;
        }

        set({ items: [...currentItems, fromProduct(product)], isOpen: true });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        const normalized = Math.min(MAX_QUANTITY, Math.max(0, Math.trunc(quantity)));
        set((state) => ({
          items: state.items
            .map((item) => item.productId === productId ? { ...item, quantity: normalized } : item)
            .filter((item) => item.quantity > 0),
        }));
      },

      clearCart: () => set({ items: [] }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addBundle: (products, discountPercentage) => {
        const discountScale = (100 - Math.max(0, Math.min(100, discountPercentage))) / 100;
        const byId = new Map(get().items.map((item) => [item.productId, item]));

        for (const product of products) {
          const existing = byId.get(product.id);
          const unitPrice = Math.round(product.price * discountScale);
          if (existing) {
            byId.set(
              product.id,
              fromProduct(product, Math.min(MAX_QUANTITY, existing.quantity + 1), unitPrice),
            );
          } else {
            byId.set(product.id, fromProduct(product, 1, unitPrice));
          }
        }

        set({ items: Array.from(byId.values()), isOpen: true });
      },

      // Persisted carts can outlive catalog changes. Refresh names, images and
      // authoritative display prices while removing SKUs no longer offered.
      syncWithCatalog: (products) => {
        const catalog = new Map(products.map((product) => [product.id, product]));
        const synced = get().items.flatMap((item) => {
          const product = catalog.get(item.productId);
          if (!product) return [];
          return [fromProduct(product, item.quantity)];
        });
        set({ items: synced });
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
    },
  ),
);
