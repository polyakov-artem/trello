import { serverUserApi } from '@/server/serverUserApi';

export type User = {
  id: string;
  name: string;
  avatarId: string;
};

export type UserWithoutId = Omit<User, 'id'>;

export const userApi = {
  async registerUser(user: UserWithoutId, throwError?: boolean): Promise<User> {
    return await serverUserApi.registerUser(user, throwError);
  },

  async removeUser(id: string, throwError?: boolean): Promise<void> {
    return await serverUserApi.removeUser(id, throwError);
  },

  async getUsers(throwError?: boolean): Promise<User[]> {
    return await serverUserApi.getUsers(throwError);
  },

  async getUserById(
    userId: string,
    sessionId: string,
    abortController: Promise<void>,
    throwError?: boolean
  ) {
    const userFetchPromise = serverUserApi.getUserById(userId, sessionId, throwError);
    return (await Promise.race([abortController, userFetchPromise])) as User;
  },
};
