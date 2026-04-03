import type { FC, PropsWithChildren } from 'react';
import { useBoardsQuery } from './useBoardsQuery';
import { useMemo } from 'react';
import { BoardsMapContext, type BoardsMapContextValue } from './BoardsMapContext';

export const BoardsMapProvider: FC<PropsWithChildren> = ({ children }) => {
  const { boards } = useBoardsQuery();

  const map = useMemo(() => {
    const map: BoardsMapContextValue = {};

    if (!boards) return map;

    return boards.reduce((acc, board) => {
      acc[board.id] = board;

      return acc;
    }, map);
  }, [boards]);

  return <BoardsMapContext value={map}>{children}</BoardsMapContext>;
};
