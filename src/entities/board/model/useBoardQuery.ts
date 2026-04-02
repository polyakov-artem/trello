import { errorNames } from '@/shared/lib/safeFetch';
import { useBoardsQuery } from './useBoardsQuery';
import { useMemo } from 'react';

export const errorBoardNotFound = { message: 'Board was not found', name: errorNames.http };

export const useBoardQuery = (boardId: string) => {
  const { boardsError, isFetchingBoards, isPendingBoards, boards } = useBoardsQuery();

  const board = useMemo(() => {
    return boards?.find((board) => board.id === boardId);
  }, [boards, boardId]);

  const boardError = isFetchingBoards
    ? undefined
    : boardsError
      ? boardsError
      : board
        ? undefined
        : errorBoardNotFound;

  return { boardError, isFetchingBoard: isFetchingBoards, isPendingBoard: isPendingBoards, board };
};
