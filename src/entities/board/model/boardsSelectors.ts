import { errorNames, type FetchError } from '@/shared/lib/safeFetch';
import { useBoardsStore } from './boardsStore';
import { useMemo } from 'react';

const boardNotFoundError: FetchError = { message: 'Board was not found', name: errorNames.unknown };

export const useBoardsError = () => useBoardsStore((s) => s.error);
export const useBoardsIsLoading = () => useBoardsStore((s) => s.isLoading);
export const useBoardsIds = () => useBoardsStore((s) => s.value.ids);
export const useBoardsEntities = () => useBoardsStore((s) => s.value.entities);
export const useBoardsStoreActions = () => useBoardsStore((s) => s.actions);

export const useBoard = (id: string) => useBoardsStore((s) => s.value.entities[id]);
export const useBoardIsLoading = () => useBoardsStore((s) => s.isLoading);

export const useBoardError = (id: string) =>
  useBoardsStore((s) => {
    const isLoading = s.isLoading;
    const boardsError = s.error;
    const board = s.value.entities[id];

    return boardsError ? boardsError : !isLoading && !board ? boardNotFoundError : undefined;
  });

export const useBoardsArray = () => {
  const ids = useBoardsStore((s) => s.value.ids);
  const entities = useBoardsStore((s) => s.value.entities);

  return useMemo(() => ids.map((id) => entities[id]), [ids, entities]);
};
