import { create } from 'zustand';
import type { Session } from '@/shared/api/auth/authApi';

type AuthStoreState = {
  sessionId: string;
  userId: string;
  isLoadingSession: boolean;
  actions: {
    setSession: (session: Session) => void;
    removeSession: () => void;
    setIsLoadingSession: (isLoadingSession: boolean) => void;
  };
};

export const useAuthStore = create<AuthStoreState>((set) => {
  return {
    sessionId: '',
    userId: '',
    isLoadingSession: false,
    actions: {
      setSession: (session: Session) => {
        set(session);
      },
      removeSession: () => {
        set({ sessionId: '', userId: '' });
      },
      setIsLoadingSession: (isLoadingSession: boolean) => set({ isLoadingSession }),
    },
  };
});

export const authStore = useAuthStore;
export const useSessionId = () => useAuthStore((state) => state.sessionId);
export const useSessionUserId = () => useAuthStore((state) => state.userId);
export const useIsLoadingSession = () => useAuthStore((state) => state.isLoadingSession);
export const useAuthStoreActions = () => useAuthStore((state) => state.actions);
