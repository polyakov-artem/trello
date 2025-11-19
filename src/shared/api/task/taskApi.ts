import { safeFetch } from '@/shared/lib/safeFetch';
import { API_URL } from '../constants';

export type Task = {
  id: string;
  authorId: string;
  title: string;
  description: string;
  completed: boolean;
};

export type TaskDraft = Partial<Omit<Task, 'id' | 'authorId'>>;

export const taskApi = {
  async getTasks(sessionId: string, signal?: AbortSignal) {
    return await safeFetch<Task[]>(`${API_URL}/tasks?sessionId=${sessionId}`, {
      signal,
    });
  },

  async createTask(sessionId: string, task: TaskDraft, signal?: AbortSignal) {
    return await safeFetch<Task>(`${API_URL}/tasks?sessionId=${sessionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
      signal,
    });
  },

  async updateTask(sessionId: string, taskId: string, task: TaskDraft, signal?: AbortSignal) {
    return await safeFetch<Task>(`${API_URL}/tasks/${taskId}?sessionId=${sessionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
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
