import type { Board } from '@/shared/api/board/boardApi';
import { createStrictContext, useStrictContext } from '@/shared/lib/reactStrictContext';

export type BoardsMapContextValue = Record<string, Board>;

export const BoardsMapContext = createStrictContext<BoardsMapContextValue>();

export const useBoardsMapContext = () => {
  return useStrictContext<BoardsMapContextValue>(BoardsMapContext);
};
