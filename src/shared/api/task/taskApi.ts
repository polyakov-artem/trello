import { safeFetch } from '@/shared/lib/safeFetch';
import { API_URL } from '../constants';
import type { Task, TaskDraft } from '@/shared/types/types';

export const taskApi = {
  async getTasks({ sessionId, signal }: { sessionId: string; signal?: AbortSignal }) {
    return await safeFetch<Task[]>(`${API_URL}/tasks?sessionId=${sessionId}`, {
      signal,
      throwOnError: true,
    });
  },

  async updateTask({
    sessionId,
    taskId,
    taskDraft,
    signal,
  }: {
    sessionId: string;
    taskId: string;
    taskDraft: TaskDraft;
    signal?: AbortSignal;
  }) {
    return await safeFetch<Task>(`${API_URL}/tasks/${taskId}?sessionId=${sessionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskDraft),
      signal,
      throwOnError: true,
    });
  },

  async deleteTasks({
    sessionId,
    tasksIds,
    signal,
  }: {
    sessionId: string;
    tasksIds: string[];
    signal?: AbortSignal;
  }) {
    return await safeFetch<{ success: true }>(`${API_URL}/tasks/delete?sessionId=${sessionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tasksIds }),
      signal,
      throwOnError: true,
    });
  },
};
