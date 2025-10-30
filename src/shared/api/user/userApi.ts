import { serverUserApi } from '@/server/serverUserApi';
import { getResponseData } from '@/shared/lib/getResponseData';

export type User = {
  id: string;
  name: string;
  avatarId: string;
};

export type UserWithoutId = Omit<User, 'id'>;

export const userApi = {
  async registerUser(user: UserWithoutId) {
    return await getResponseData(serverUserApi.registerUser(user));
  },

  async removeUser(id: string) {
    return await getResponseData(serverUserApi.removeUser(id));
  },

  async getUsers() {
    return await getResponseData(serverUserApi.getUsers());
  },

  async getUserById(userId: string, sessionId: string, abortController: Promise<void>) {
    const userFetchPromise = serverUserApi.getUserById(userId, sessionId);
    return await getResponseData(
      Promise.race([abortController, userFetchPromise]) as Promise<User>
    );
  },
};
