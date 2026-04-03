import { API_URL } from '../constants';
import { safeFetch } from '@/shared/lib/safeFetch';

export type Session = {
  sessionId: string;
  userId: string;
};

export const authApi = {
  loginWithSessionId: async ({
    sessionId,
    signal,
  }: {
    sessionId: string;
    signal?: AbortSignal;
  }) => {
    return await safeFetch<Session>(`${API_URL}/sessions/login?sessionId=${sessionId}`, {
      method: 'POST',
      signal,
      throwOnError: true,
    });
  },

  loginWithUserId: async ({ userId, signal }: { userId: string; signal?: AbortSignal }) => {
    return await safeFetch<Session>(`${API_URL}/sessions/login/${userId}`, {
      method: 'POST',
      signal,
      throwOnError: true,
    });
  },

  logout: async ({ sessionId, signal }: { sessionId: string; signal?: AbortSignal }) => {
    return await safeFetch<{ success: true }>(`${API_URL}/sessions/logout?sessionId=${sessionId}`, {
      method: 'POST',
      signal,
      throwOnError: true,
    });
  },
};
