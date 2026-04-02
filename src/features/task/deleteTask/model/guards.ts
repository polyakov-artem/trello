import { useIsModifyingBoards } from '@/entities/board';
import { useSessionId } from '@/entities/session';
import { useIsModifyingTasks } from '@/entities/task';

export const useCanDeleteTasks = (tasksIds: string[], boardsIds: string[]) => {
  const sessionId = useSessionId();
  const isModifyingTasks = useIsModifyingTasks(tasksIds);
  const isModifyingBoards = useIsModifyingBoards(boardsIds);

  return (
    !!tasksIds.length &&
    !!boardsIds.length &&
    !isModifyingTasks &&
    !!sessionId &&
    !isModifyingBoards
  );
};
