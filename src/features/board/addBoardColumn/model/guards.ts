import { useBoard, useIsModifyingBoards } from '@/entities/board';
import { useSessionId } from '@/entities/session';

export const useCanAddBoardColumn = () => {
  const boardId = useBoard().id;
  const sessionId = useSessionId();
  const isModifyingBoard = useIsModifyingBoards(boardId);

  return !!sessionId && !isModifyingBoard;
};
