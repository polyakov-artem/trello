import { useBoardsStore } from '@/entities/board';
import { boardApi } from '@/shared/api/board/boardApi';
import { useCallback } from 'react';
import type { FetchResult } from '@/shared/lib/safeFetch';
import type { Board } from '@/shared/api/board/boardApi';
import { useSessionStore } from '@/entities/session';

export const useLoadBoards = () => {
  const checkIfLoadingSession = useSessionStore.use.checkIfLoading();
  const getSession = useSessionStore.use.getValue();

  const setBoardsState = useBoardsStore.use.setState();
  const checkIfLoadingBoards = useBoardsStore.use.checkIfLoading();
  const setCancelBoardsLoadingRef = useBoardsStore.use.setCancelRef();

  const loadBoards = useCallback(
    async (signal?: AbortSignal): Promise<FetchResult<Board[]> | undefined> => {
      const sessionId = getSession()?.sessionId || '';

      if (checkIfLoadingBoards() || checkIfLoadingSession() || !sessionId) {
        return;
      }

      setBoardsState({ isLoading: true, error: undefined });

      const controller = new AbortController();
      setCancelBoardsLoadingRef(() => controller.abort());

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
    [
      checkIfLoadingSession,
      checkIfLoadingBoards,
      getSession,
      setCancelBoardsLoadingRef,
      setBoardsState,
    ]
  );

  return loadBoards;
};
