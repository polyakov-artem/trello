import { createCustomStore } from '@/shared/lib/zustandCustomStore';
import type { Task } from '@/shared/api/task/taskApi';

export const useTasksStore = createCustomStore<Task[]>([]);
export const useTaskDeletionStore = createCustomStore(undefined);
export const useTaskCreationStore = createCustomStore(undefined);
export const useTaskUpdateStore = createCustomStore(undefined);
