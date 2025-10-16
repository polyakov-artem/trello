import { serverUserApi } from '@/server/serverUserApi';

export type User = {
  id: string;
  name: string;
  avatarId: string;
};

export type UserWithoutId = Omit<User, 'id'>;

export const userApi = {
  async addUser(user: UserWithoutId, throwError?: boolean): Promise<User> {
    return await serverUserApi.addUser(user, throwError);
  },

  async removeUser(id: string, throwError?: boolean): Promise<void> {
    return await serverUserApi.removeUser(id, throwError);
  },

  async getUsers(throwError?: boolean): Promise<User[]> {
    return await serverUserApi.getUsers(throwError);
  },

  async getUserById(userId: string, throwError?: boolean): Promise<User> {
    return await serverUserApi.getUserById(userId, throwError);
  },
};
