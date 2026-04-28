import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from './useAuthStore';

interface UsersState {
  users: User[];
  addUser: (user: User) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  removeUser: (id: string) => void;
}

const initialUsers: User[] = [
  { id: '1', username: 'admin', role: 'Admin', permissions: ['ALL_PERMISSIONS'], password: 'admin' },
  { id: '2', username: 'cajero1', role: 'Cajero', permissions: ['Cajero'], password: '123' },
];

export const useUsersStore = create<UsersState>()(
  persist(
    (set) => ({
      users: initialUsers,
      addUser: (user) => set((state) => ({ users: [...state.users, user] })),
      updateUser: (id, updatedFields) => set((state) => ({
        users: state.users.map(u => u.id === id ? { ...u, ...updatedFields } : u)
      })),
      removeUser: (id) => set((state) => ({ users: state.users.filter(u => u.id !== id) }))
    }),
    {
      name: 'bwp-users'
    }
  )
);
