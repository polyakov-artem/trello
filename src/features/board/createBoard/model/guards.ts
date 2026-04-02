import { useSessionId } from '@/entities/session';
import { mutationKeys } from '@/shared/config/queries';
import { useIsMutating } from '@tanstack/react-query';

export const useCanCreateBoard = () => {
  const sessionId = useSessionId();
  const isCreatingBoard =
    useIsMutating({
      mutationKey: mutationKeys.createBoard({ sessionId }),
    }) > 0;

  return !!sessionId && !isCreatingBoard;
};
