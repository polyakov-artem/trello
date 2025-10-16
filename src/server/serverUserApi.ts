import { delay } from '@/shared/lib/delay';
import { nanoid } from 'nanoid';
import localForage from 'localforage';

export type User = {
  id: string;
  name: string;
  avatarId: string;
};

export type UserWithoutId = Omit<User, 'id'>;

const USERS_STORAGE_KEY = 'server_trello_users';
const ERROR_USERS_LOADING_FAILED = 'Failed to load users';
const ERROR_USER_LOADING_FAILED = 'Failed to load user';
const ERROR_USER_ADDING_FAILED = 'Failed to add user';
const ERROR_USER_REMOVING_FAILED = 'Failed to remove user';

export const serverUserApi = {
  async addUser(user: UserWithoutId, throwError?: boolean): Promise<User> {
    await delay(500);

    if (throwError) {
      throw new Error(ERROR_USER_ADDING_FAILED);
    }
    const users = await loadUsers();
    const newUser = { ...user, id: nanoid() };
    users.push(newUser);
    await saveUsers(users);
    return newUser;
  },

  async removeUser(id: string, throwError?: boolean): Promise<void> {
    await delay(500);

    if (throwError) {
      throw new Error(ERROR_USER_REMOVING_FAILED);
    }

    const users = await loadUsers();
    await saveUsers(users.filter((u) => u.id !== id));
  },

  async getUsers(throwError?: boolean): Promise<User[]> {
    await delay(500);

    if (throwError) {
      throw new Error(ERROR_USERS_LOADING_FAILED);
    }

    return loadUsers();
  },

  async getUserById(userId: string, throwError?: boolean): Promise<User> {
    await delay(500);

    if (throwError) {
      throw new Error(ERROR_USERS_LOADING_FAILED);
    }

    const users = await loadUsers();

    const user = users.find((u) => u.id === userId);

    if (!user) {
      throw new Error(ERROR_USER_LOADING_FAILED);
    }

    return user;
  },
};

export const loadUsers = async () => {
  return (await localForage.getItem<User[]>(USERS_STORAGE_KEY)) || [];
};

export const saveUsers = async (users: User[]) => {
  return await localForage.setItem(USERS_STORAGE_KEY, users);
};
