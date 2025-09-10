import { create } from 'zustand';
import { nanoid } from 'nanoid';

export type User = {
  id: string;
  name: string;
  avatarId: string;
};

export type UserWithoutId = Omit<User, 'id'>;

export type UsersStoreState = {
  users: User[];
  isLoadingUsers: boolean;
  usersLoadingError: string;
  isRemovingUser: boolean;
  userRemovingError: string;
  isAddingUser: boolean;
  userAddingError: string;
  getUsers: () => User[];
  setUsers: (users: User[]) => void;
  removeUser: (id: string) => void;
  setIsLoadingUsers: (isLoading: boolean) => void;
  setIsRemovingUser: (isRemovingUser: boolean) => void;
  setIsAddingUser: (isAddingUser: boolean) => void;
  setUserRemovingError: (error: string) => void;
  setUserAddingError: (error: string) => void;
  setUsersLoadingError: (error: string) => void;
  addUser: (user: User) => void;
};

export const useUsersStore = create<UsersStoreState>((set, get) => ({
  users: [],
  isLoadingUsers: false,
  isRemovingUser: false,
  isAddingUser: false,
  usersLoadingError: '',
  userRemovingError: '',
  userAddingError: '',
  getUsers: () => get().users,
  setUsers: (users: User[]) => {
    set({ users });
  },
  removeUser: (id: string) => {
    set({ users: get().users.filter((u) => u.id !== id) });
  },
  addUser: (user) => {
    set((state) => ({
      users: [
        ...state.users,
        {
          ...user,
          id: nanoid(),
        },
      ],
    }));
  },
  setIsLoadingUsers: (isLoadingUsers: boolean) => set({ isLoadingUsers }),
  setIsRemovingUser: (isRemovingUser: boolean) => set({ isRemovingUser }),
  setIsAddingUser: (isAddingUser: boolean) => set({ isAddingUser }),
  setUserRemovingError: (userRemovingError: string) => set({ userRemovingError }),
  setUserAddingError: (userAddingError: string) => set({ userAddingError }),
  setUsersLoadingError: (usersLoadingError) => set({ usersLoadingError }),
}));
