import { API_URL } from '../constants';
import { safeFetch } from '@/shared/lib/safeFetch';

export type Session = {
  sessionId: string;
  userId: string;
};

export const authApi = {
  loginWithSessionId: async (sessionId: string, signal?: AbortSignal) => {
    return await safeFetch<Session>(`${API_URL}/sessions/login/session?sessionId=${sessionId}`, {
      method: 'POST',
      signal,
    });
  },

  loginWithUserId: async (userId: string, signal?: AbortSignal) => {
    return await safeFetch<Session>(`${API_URL}/sessions/login/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
      signal,
    });
  },

  logout: async (sessionId: string, signal?: AbortSignal) => {
    return await safeFetch<{ success: true }>(`${API_URL}/sessions/logout?sessionId=${sessionId}`, {
      method: 'POST',
      signal,
    });
  },
};
