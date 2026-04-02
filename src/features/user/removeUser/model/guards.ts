import { useSessionId } from '@/entities/session';
import { getUserKeyObj } from '@/shared/config/queries';
import { useIsMutating } from '@tanstack/react-query';

export const useCanRemoveUser = (userId: string) => {
  const sessionId = useSessionId();
  const isRemovingUser =
    useIsMutating({ mutationKey: [getUserKeyObj({ idOrIds: userId, sessionId })] }) > 0;

  return !isRemovingUser && !!sessionId;
};
