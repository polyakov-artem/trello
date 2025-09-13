import { create } from 'zustand';
import { createSelectors } from '@/shared/lib/zustand';
import type { User } from '@/shared/api/user/userApi';

export type UsersStoreState = {
  users: User[];
  isLoadingUsers: boolean;
  usersLoadingError: string;
  isAddingUser: boolean;
  isRemovingUser: boolean;

  setUsers: (users: User[]) => void;
  setIsLoadingUsers: (isLoadingUsers: boolean) => void;
  setUsersLoadingError: (usersLoadingError: string) => void;

  addUser: (user: User) => void;
  setIsAddingUser: (isAddingUser: boolean) => void;

  removeUser: (id: string) => void;
  setIsRemovingUser: (isRemovingUser: boolean) => void;
};

export const useUsersStoreBase = create<UsersStoreState>((set, get) => ({
  users: [],
  usersLoadingError: '',
  isLoadingUsers: false,
  isAddingUser: false,
  isRemovingUser: false,

  setUsers: (users: User[]) => set({ users }),
  setIsLoadingUsers: (isLoadingUsers: boolean) => set({ isLoadingUsers }),
  setUsersLoadingError: (usersLoadingError: string) => set({ usersLoadingError }),

  addUser: (user: User) => {
    set({ users: [...get().users, user] });
  },
  setIsAddingUser: (isAddingUser: boolean) => set({ isAddingUser }),

  removeUser: (id: string) => {
    set({ users: get().users.filter((u) => u.id !== id) });
  },
  setIsRemovingUser: (isRemovingUser: boolean) => set({ isRemovingUser }),
}));

export const useUsersStore = createSelectors(useUsersStoreBase);
