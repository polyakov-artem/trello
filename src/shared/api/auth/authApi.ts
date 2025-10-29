import { serverAuthApi } from '@/server/serverAuthApi';

export type Session = {
  sessionId: string;
  userId: string;
};

export type Sessions = Record<string, Session>;
export type LoginResponse = Session;

export const authApi = {
  async loginWithSessionId(sessionId: string, throwError?: boolean): Promise<LoginResponse> {
    return await serverAuthApi.loginWithSessionId(sessionId, throwError);
  },

  async loginWithUserId(userId: string, throwError?: boolean): Promise<LoginResponse> {
    return await serverAuthApi.loginWithUserId(userId, throwError);
  },

  async logout(sessionId: string, throwError?: boolean): Promise<void> {
    return await serverAuthApi.logout(sessionId, throwError);
  },
};
