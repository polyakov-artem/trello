import { persistStorage } from '@/shared/lib/persistStorage';

export type User = {
  id: string;
  name: string;
  avatarId: string;
};

const USERS_STORAGE_KEY = 'trello_users';

export const userApi = {
  async addUser(user: User): Promise<void> {
    const users = await userApi.getUsers();
    users.push(user);
    await persistStorage.setItem(USERS_STORAGE_KEY, users);
  },

  async removeUser(id: string): Promise<void> {
    const users = await userApi.getUsers();

    await persistStorage.setItem(
      USERS_STORAGE_KEY,
      users.filter((u) => u.id !== id)
    );
  },

  async getUsers(): Promise<User[]> {
    return persistStorage.getItemSafe<User[]>(USERS_STORAGE_KEY, []);
  },
};
