import { useSessionId } from '@/entities/session';
import { getKeyWithPrefix, mKeysMap } from '@/shared/config/queries';
import { isObject } from '@/shared/lib/isObject';
import { useIsMutating } from '@tanstack/react-query';

function isTaskRelatedKey(value: unknown): value is Record<string, string> {
  return isObject(value) && mKeysMap.task in value && mKeysMap.sessionId in value;
}

export const useIsModifyingTasks = (idOrIds: string | string[]) => {
  const sessionId = useSessionId();

  return (
    useIsMutating({
      predicate: (mutation) => {
        const key = mutation.options.mutationKey?.[0];

        if (isTaskRelatedKey(key) && sessionId === key.sessionId) {
          if (Array.isArray(idOrIds)) {
            return idOrIds.some((taskId) => getKeyWithPrefix(taskId, mKeysMap.task) in key);
          }

          return getKeyWithPrefix(idOrIds, mKeysMap.task) in key;
        }

        return false;
      },
    }) > 0
  );
};
