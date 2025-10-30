import { serverAuthApi } from '@/server/serverAuthApi';
import { getResponseData } from '@/shared/lib/getResponseData';

export type Session = {
  sessionId: string;
  userId: string;
};

export const authApi = {
  async loginWithSessionId(sessionId: string) {
    return await getResponseData(serverAuthApi.loginWithSessionId(sessionId));
  },

  async loginWithUserId(userId: string) {
    return await getResponseData(serverAuthApi.loginWithUserId(userId));
  },

  async logout(sessionId: string) {
    return await getResponseData(serverAuthApi.logout(sessionId));
  },
};
