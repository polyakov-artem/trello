import { type Board } from '@/shared/api/board/boardApi';
import { useCallback } from 'react';
import { useBoardsStoreActions, useBoardUpdateStore } from '@/entities/board';
import type { FetchResult } from '@/shared/lib/safeFetch';

export type UpdateBoardProps = {
  onStart?: () => void;
  onEnd?: () => void;
  updateFn: (signal?: AbortSignal) => Promise<FetchResult<Board>>;
  guardFn: () => boolean;
};

export const useUpdateBoard = () => {
  const setCancelReqFn = useBoardUpdateStore.use.setCancelReqFn();
  const setBoardUpdatingState = useBoardUpdateStore.use.setState();
  const { updateBoard } = useBoardsStoreActions();

  return useCallback(
    async ({ onStart, onEnd, updateFn, guardFn }: UpdateBoardProps) => {
      if (!guardFn()) {
        return;
      }

      onStart?.();
      setBoardUpdatingState({ isLoading: true, error: undefined });

      const controller = new AbortController();
      setCancelReqFn(() => controller.abort());

      const result = await updateFn(controller.signal);
      const isAborted = controller.signal.aborted;

      if (!isAborted) {
        if (result.ok) {
          updateBoard(result.data);
        } else {
          setBoardUpdatingState({ error: result.error });
        }
      }

      setBoardUpdatingState({ isLoading: false });
      onEnd?.();
      return isAborted ? undefined : result;
    },
    [setBoardUpdatingState, setCancelReqFn, updateBoard]
  );
};
