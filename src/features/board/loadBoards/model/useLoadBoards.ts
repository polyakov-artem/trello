import { useBoardsStoreActions } from '@/entities/board';
import { boardApi } from '@/shared/api/board/boardApi';
import { useCallback } from 'react';
import type { FetchResult } from '@/shared/lib/safeFetch';
import type { Board } from '@/shared/api/board/boardApi';
import { useSessionStore } from '@/entities/session';
import { useCanLoadBoardsFn } from './guards';

export const useLoadBoards = () => {
  const canLoadBoardsFn = useCanLoadBoardsFn();
  const getSessionState = useSessionStore.use.getState();

  const { setCancelReqFn, setBoards, setState } = useBoardsStoreActions();

  const loadBoards = useCallback(
    async (signal?: AbortSignal): Promise<FetchResult<Board[]> | undefined> => {
      if (!canLoadBoardsFn()) {
        return;
      }

      setState({ isLoading: true, error: undefined });

      const controller = new AbortController();
      setCancelReqFn(() => controller.abort());

      const sessionId = getSessionState().value?.sessionId || '';

      const result = await boardApi.getBoards({ sessionId, signal });
      const isAborted = controller.signal.aborted;

      if (!isAborted) {
        if (result.ok) {
          setBoards(result.data);
        } else {
          setState({ error: result.error });
        }
      }

      setState({ isLoading: false });
      return isAborted ? undefined : result;
    },
    [canLoadBoardsFn, setState, setCancelReqFn, getSessionState, setBoards]
  );

  return loadBoards;
};
