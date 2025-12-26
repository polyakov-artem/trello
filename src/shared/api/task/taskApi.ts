import { safeFetch } from '@/shared/lib/safeFetch';
import { API_URL } from '../constants';
import type { Task, TaskDraft } from '@/shared/types/types';

export const taskApi = {
  async getTasks(sessionId: string, signal?: AbortSignal) {
    return await safeFetch<Task[]>(`${API_URL}/tasks?sessionId=${sessionId}`, {
      signal,
    });
  },

  async createTask(sessionId: string, taskDraft: TaskDraft, signal?: AbortSignal) {
    return await safeFetch<Task>(`${API_URL}/tasks?sessionId=${sessionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskDraft),
      signal,
    });
  },

  async updateTask(sessionId: string, taskId: string, taskDraft: TaskDraft, signal?: AbortSignal) {
    return await safeFetch<Task>(`${API_URL}/tasks/${taskId}?sessionId=${sessionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskDraft),
      signal,
    });
  },

  async deleteTask(sessionId: string, taskId: string, signal?: AbortSignal) {
    return await safeFetch<{ success: true }>(`${API_URL}/tasks/${taskId}?sessionId=${sessionId}`, {
      method: 'DELETE',
      signal,
    });
  },
};
