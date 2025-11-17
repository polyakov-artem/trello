import { safeFetch } from '@/shared/lib/safeFetch';
import { API_URL } from '../constants';

export type Task = {
  id: string;
  authorId: string;
  editorsIds: string[];
  title: string;
  description: string;
  completed: boolean;
};

export type NewTask = Omit<Task, 'id' | 'authorId'>;

export const taskApi = {
  async getTasks(sessionId: string, signal?: AbortSignal) {
    return await safeFetch<Task[]>(`${API_URL}/tasks?sessionId=${sessionId}`, {
      signal,
    });
  },

  async createTask(sessionId: string, task: NewTask, signal?: AbortSignal) {
    return await safeFetch<Task>(`${API_URL}/tasks?sessionId=${sessionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
      signal,
    });
  },

  async updateTask(taskId: string, sessionId: string, formData: FormData, signal?: AbortSignal) {
    return await safeFetch<Task>(`${API_URL}/tasks/${taskId}?sessionId=${sessionId}`, {
      method: 'PUT',
      body: formData,
      signal,
    });
  },

  async deleteTask(taskId: string, sessionId: string, signal?: AbortSignal) {
    return await safeFetch<{ success: true }>(`${API_URL}/tasks/${taskId}?sessionId=${sessionId}`, {
      method: 'DELETE',
      signal,
    });
  },
};
