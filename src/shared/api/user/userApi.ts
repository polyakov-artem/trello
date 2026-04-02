import { safeFetch } from '@/shared/lib/safeFetch';
import { API_URL } from '../constants';

export type User = {
  id: string;
  name: string;
  avatarId: string;
};

export type UserWithoutId = Omit<User, 'id'>;

export const userApi = {
  async registerUser({ userDraft, signal }: { userDraft: UserWithoutId; signal?: AbortSignal }) {
    return await safeFetch<User>(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDraft),
      signal,
      throwOnError: true,
    });
  },

  async removeUser({
    id,
    sessionId,
    signal,
  }: {
    id: string;
    sessionId: string;
    signal?: AbortSignal;
  }) {
    return await safeFetch<{ success: true }>(`${API_URL}/users/${id}?sessionId=${sessionId}`, {
      method: 'DELETE',
      signal,
      throwOnError: true,
    });
  },

  async getUsers({ signal }: { signal?: AbortSignal }) {
    return await safeFetch<User[]>(`${API_URL}/users`, { signal, throwOnError: true });
  },

  async getUserById({
    userId,
    sessionId,
    signal,
  }: {
    userId: string;
    sessionId: string;
    signal?: AbortSignal;
  }) {
    return await safeFetch<User>(`${API_URL}/users/${userId}?sessionId=${sessionId}`, {
      signal,
      throwOnError: true,
    });
  },
};
