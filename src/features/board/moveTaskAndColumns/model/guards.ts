import { useBoard, useIsModifyingBoards } from '@/entities/board';
import { useSessionId } from '@/entities/session';

export const useCanMoveTaskOrColumn = () => {
  const sessionId = useSessionId();
  const boardId = useBoard().id;
  const isModifyingBoard = useIsModifyingBoards(boardId);

  return !!sessionId && !isModifyingBoard;
};
