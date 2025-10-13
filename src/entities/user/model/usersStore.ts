import { create } from 'zustand';
import { createSelectors } from '@/shared/lib/zustand';
import type { User } from '@/shared/api/user/userApi';

export type UsersStoreState = {
  users: User[];
  isLoadingUsers: boolean;
  usersLoadingError: string;
  isAddingUser: boolean;
  deletionQueue: Record<string, boolean>;

  setUsers: (users: User[]) => void;
  setIsLoadingUsers: (isLoadingUsers: boolean) => void;
  setUsersLoadingError: (usersLoadingError: string) => void;

  addUser: (user: User) => void;
  setIsAddingUser: (isAddingUser: boolean) => void;

  removeUser: (id: string) => void;
  addToDeletionQueue: (id: string) => void;
  removeFromDeletionQueue: (id: string) => void;
  isRemovingUserWithId: (id: string) => boolean;
};

export const useUsersStoreBase = create<UsersStoreState>((set, get) => ({
  users: [],
  usersLoadingError: '',
  isLoadingUsers: false,
  isAddingUser: false,
  deletionQueue: {},

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

  addToDeletionQueue: (id: string) => {
    const deletionQueue = { ...get().deletionQueue };
    deletionQueue[id] = true;
    set({ deletionQueue });
  },

  removeFromDeletionQueue: (id: string) => {
    const deletionQueue = { ...get().deletionQueue };
    delete deletionQueue[id];
    set({ deletionQueue });
  },

  isRemovingUserWithId: (id: string) => {
    return get().deletionQueue[id];
  },
}));

export const useUsersStore = createSelectors(useUsersStoreBase);
