import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Order {
  id: string;
  date: string;
  subtotal: number;
  tax: number;
  total: number;
}

interface OrdersState {
  orders: Order[];
  addOrder: (order: Order) => void;
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (order) => set((state) => ({ orders: [...state.orders, order] }))
    }),
    {
      name: 'bwp-orders'
    }
  )
);
