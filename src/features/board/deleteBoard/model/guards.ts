import { useIsModifyingBoards } from '@/entities/board';
import { useSessionId } from '@/entities/session';

export const useCanDeleteBoard = (boardId: string) => {
  const sessionId = useSessionId();
  const isModifyingBoard = useIsModifyingBoards(boardId);

  return !!sessionId && !isModifyingBoard;
};
