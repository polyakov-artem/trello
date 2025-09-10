import { persistStorage } from '@/shared/lib/persistStorage';
import { nanoid } from 'nanoid';

export type User = {
  id: string;
  name: string;
  avatarId: string;
};

export type UserWithoutId = Omit<User, 'id'>;

const USERS_STORAGE_KEY = 'trello_users';
const ERROR_USERS_LOADING_FAILED = 'Failed to load users';
const ERROR_USER_ADDING_FAILED = 'Failed to add user';
const ERROR_USER_REMOVING_FAILED = 'Failed to remove user';

export const userApi = {
  async addUser(user: UserWithoutId, throwError?: boolean): Promise<User> {
    if (throwError) {
      throw new Error(ERROR_USER_ADDING_FAILED);
    }
    const users = await userApi.getUsers();
    const newUser = { ...user, id: nanoid() };
    users.push(newUser);
    await persistStorage.setItem(USERS_STORAGE_KEY, users);
    return newUser;
  },

  async removeUser(id: string, throwError?: boolean): Promise<void> {
    if (throwError) {
      throw new Error(ERROR_USER_REMOVING_FAILED);
    }

    const users = await userApi.getUsers();

    await persistStorage.setItem(
      USERS_STORAGE_KEY,
      users.filter((u) => u.id !== id)
    );
  },

  async getUsers(throwError?: boolean): Promise<User[]> {
    if (throwError) {
      throw new Error(ERROR_USERS_LOADING_FAILED);
    }

    return persistStorage.getItemSafe<User[]>(USERS_STORAGE_KEY, []);
  },
};
