import { useSessionId } from '@/entities/session';
import { getKeyWithPrefix, mKeysMap } from '@/shared/config/queries';
import { isObject } from '@/shared/lib/isObject';
import { useIsMutating } from '@tanstack/react-query';

const isBoardRelatedKey = (key: unknown): key is Record<string, string> => {
  return isObject(key) && mKeysMap.board in key && mKeysMap.sessionId in key;
};

export const useIsModifyingBoards = (idOrIds: string[] | string) => {
  const sessionId = useSessionId();

  return (
    useIsMutating({
      predicate: (mutation) => {
        const key = mutation.options.mutationKey?.[0];

        if (isBoardRelatedKey(key) && sessionId === key.sessionId) {
          if (Array.isArray(idOrIds)) {
            return idOrIds.some((boardId) => getKeyWithPrefix(boardId, mKeysMap.board) in key);
          }

          return getKeyWithPrefix(idOrIds, mKeysMap.board) in key;
        }

        return false;
      },
    }) > 0
  );
};
