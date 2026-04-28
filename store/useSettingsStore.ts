import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CompanySettings {
  name: string;
  rtn: string;
  cai: string;
  correlativoInfo: string;
  address: string;
  email: string;
  phone: string;
  ticketFooter: string;
  exchangeRate: number;
}

interface SettingsState {
  company: CompanySettings;
  updateCompany: (settings: Partial<CompanySettings>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      company: {
        name: 'SUPERMERCADO CENTRAL',
        rtn: '08019000000000',
        cai: '123456-789012-345678-901234-56',
        correlativoInfo: '000-001-01-00000001 al 000-001-01-00500000',
        address: 'Blvd. Principal, Local 4, Ciudad',
        email: 'contacto@supermercado.com',
        phone: '+504 2222-3333',
        ticketFooter: '¡Gracias por su compra!',
        exchangeRate: 26.0
      },
      updateCompany: (settings) => set((state) => ({ company: { ...state.company, ...settings } }))
    }),
    {
      name: 'bwp-settings'
    }
  )
);
