import { useSessionStore } from '@/entities/session';

export const useCanCreateTask = () => {
  const sessionUser = useSessionStore.use.sessionUser();
  return !!sessionUser;
};
