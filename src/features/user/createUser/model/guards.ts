import { useIsMutating } from '@tanstack/react-query';
import { mutationKeys } from '../../../../shared/config/queries';

export const useCanCreateUser = () => {
  const isCreatingUser = useIsMutating({ mutationKey: mutationKeys.createUser }) > 0;

  return !isCreatingUser;
};
