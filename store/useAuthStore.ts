import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'Admin' | 'Gerente' | 'Cajero' | 'Supervisor' | 'Auditor';

export interface User {
  id: string;
  username: string;
  role: Role;
  permissions: string[];
  password?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, role: Role, permissions: string[]) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (username, role, permissions) =>
        set({
          user: { id: Date.now().toString(), username, role, permissions },
          isAuthenticated: true,
        }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'bwp-auth-storage',
    }
  )
);
