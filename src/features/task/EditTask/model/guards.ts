import { useSessionId } from '@/entities/session';
import { useIsModifyingTasks } from '@/entities/task';

export const useCanEditTask = (taskId: string) => {
  const sessionId = useSessionId();
  const isModifyingTask = useIsModifyingTasks(taskId);

  return !isModifyingTask && !!sessionId;
};
