import { createCustomStore } from '@/shared/lib/zustandCustomStore';
import type { Task } from '@/shared/types/types';

export const useTasksStore = createCustomStore<Task[] | undefined>(undefined);
export const useTaskDeletionStore = createCustomStore(undefined);
export const useTaskCreationStore = createCustomStore(undefined);
export const useTaskUpdateStore = createCustomStore(undefined);
