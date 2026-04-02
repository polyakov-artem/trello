import { useIsModifyingBoards } from '@/entities/board';
import { useSessionId } from '@/entities/session';

export const useCanEditBoard = (boardId: string) => {
  const sessionId = useSessionId();
  const isModifyingBoard = useIsModifyingBoards(boardId);

  return !!sessionId && !isModifyingBoard;
};
