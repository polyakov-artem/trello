import { useBoardsStore } from '@/entities/board';
import { boardApi } from '@/shared/api/board/boardApi';
import { useCallback } from 'react';
import type { FetchResult } from '@/shared/lib/safeFetch';
import type { Board } from '@/shared/api/board/boardApi';
import { useSessionStore } from '@/entities/session';
import { useCanLoadBoardsFn } from './guards';

export const useLoadBoards = () => {
  const canLoadBoardsFn = useCanLoadBoardsFn();
  const getSessionState = useSessionStore.use.getState();

  const setBoardsState = useBoardsStore.use.setState();
  const setCancelBoardsLoadingRef = useBoardsStore.use.setCancelRef();

  const loadBoards = useCallback(
    async (signal?: AbortSignal): Promise<FetchResult<Board[]> | undefined> => {
      if (!canLoadBoardsFn()) {
        return;
      }

      setBoardsState({ isLoading: true, error: undefined });

      const controller = new AbortController();
      setCancelBoardsLoadingRef(() => controller.abort());

      const sessionId = getSessionState().value?.sessionId || '';

      const result = await boardApi.getBoards(sessionId, signal);
      const isAborted = controller.signal.aborted;

      if (!isAborted) {
        if (result.ok) {
          setBoardsState({ value: result.data });
        } else {
          setBoardsState({ error: result.error });
        }
      }

      setBoardsState({ isLoading: false });
      return isAborted ? undefined : result;
    },
    [canLoadBoardsFn, getSessionState, setCancelBoardsLoadingRef, setBoardsState]
  );

  return loadBoards;
};
