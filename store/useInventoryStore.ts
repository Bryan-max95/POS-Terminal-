import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from './usePosStore';

interface InventoryState {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
}

const initialProducts: Product[] = [
  { id: '1', sku: 'SKU001', barcode: '123456789', name: 'Manzana Gala (1lb)', price: 1.99, cost: 0.8, stock: 100, category: 'Frutas', tax: 0.0 },
  { id: '2', sku: 'SKU002', barcode: '123456790', name: 'Huevos Grandes (12x)', price: 3.50, cost: 2.0, stock: 50, category: 'Lácteos', tax: 0.0 },
  { id: '3', sku: 'SKU003', barcode: '123456791', name: 'Leche Deslactosada 1L', price: 1.20, cost: 0.90, stock: 30, category: 'Lácteos', tax: 0.0 },
  { id: '4', sku: 'SKU004', barcode: '123456792', name: 'Pan de Molde Blanco', price: 2.50, cost: 1.2, stock: 40, category: 'Panadería', tax: 0.15 },
  { id: '5', sku: 'SKU005', barcode: '123456793', name: 'Detergente en Polvo 1kg', price: 4.99, cost: 3.0, stock: 80, category: 'Limpieza', tax: 0.15 },
  { id: '6', sku: 'SKU006', barcode: '123456794', name: 'Arroz Blanco (2lb)', price: 1.50, cost: 0.8, stock: 120, category: 'Abarrotes', tax: 0.0 },
];

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set) => ({
      products: initialProducts,
      addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
      updateProduct: (id, updatedFields) => set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, ...updatedFields } : p)
      }))
    }),
    {
      name: 'bwp-inventory'
    }
  )
);
