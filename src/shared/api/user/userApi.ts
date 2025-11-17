import { safeFetch } from '@/shared/lib/safeFetch';
import { API_URL } from '../constants';

export type User = {
  id: string;
  name: string;
  avatarId: string;
};

export type UserWithoutId = Omit<User, 'id'>;

export const userApi = {
  async registerUser(user: UserWithoutId, signal?: AbortSignal) {
    return await safeFetch<User>(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
      signal,
    });
  },

  async removeUser(id: string, sessionId: string, signal?: AbortSignal) {
    return await safeFetch<{ success: true }>(`${API_URL}/users/${id}?sessionId=${sessionId}`, {
      method: 'DELETE',
      signal,
    });
  },

  async getUsers(signal?: AbortSignal) {
    return await safeFetch<User[]>(`${API_URL}/users`, { signal });
  },

  async getUserById(userId: string, sessionId: string, signal?: AbortSignal) {
    return await safeFetch<User>(`${API_URL}/users/${userId}?sessionId=${sessionId}`, {
      signal,
    });
  },
};
