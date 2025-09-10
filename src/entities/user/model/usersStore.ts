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
  getUsers: () => User[];
  removeUser: (id: string) => void;
  addUser: (user: UserWithoutId) => void;
};

export const useUsersStore = create<UsersStoreState>((set, get) => ({
  users: [],
  getUsers: () => get().users,
  removeUser: (id: string) => {
    set({ users: get().users.filter((u) => u.id !== id) });
  },
  addUser: (user) => {
    const users = get().users;

    users.push({
      ...user,
      id: nanoid(),
    });

    set({ users });
  },
}));
