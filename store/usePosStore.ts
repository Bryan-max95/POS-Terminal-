import { create } from 'zustand';

export interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  cost: number;
  stock: number;
  category: string;
  image?: string;
  barcode: string;
  tax: number; // Percentage like 0.16 for 16%
}

export interface CartItem extends Product {
  cartId: string; // unique id in cart
  quantity: number;
  discount: number; // fixed amount or percentage off
}

interface PosState {
  cart: CartItem[];
  globalDiscount: number;
  selectedClient: string | null;
  paymentMethod: string | null;
  
  addToCart: (product: Product) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  setGlobalDiscount: (discount: number) => void;
  setClient: (clientId: string) => void;
  setPaymentMethod: (method: string) => void;
  clearCart: () => void;
}

export const usePosStore = create<PosState>((set) => ({
  cart: [],
  globalDiscount: 0,
  selectedClient: null,
  paymentMethod: null,

  addToCart: (product) => set((state) => {
    const existing = state.cart.find((item) => item.id === product.id);
    if (existing) {
      return {
        cart: state.cart.map((item) => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      };
    }
    return {
      cart: [...state.cart, { ...product, cartId: Math.random().toString(), quantity: 1, discount: 0 }]
    };
  }),

  removeFromCart: (cartId) => set((state) => ({
    cart: state.cart.filter((item) => item.cartId !== cartId)
  })),

  updateQuantity: (cartId, quantity) => set((state) => ({
    cart: state.cart.map((item) => 
      item.cartId === cartId ? { ...item, quantity } : item
    )
  })),

  setGlobalDiscount: (discount) => set({ globalDiscount: discount }),
  setClient: (clientId) => set({ selectedClient: clientId }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  
  clearCart: () => set({ cart: [], globalDiscount: 0, selectedClient: null, paymentMethod: null })
}));
