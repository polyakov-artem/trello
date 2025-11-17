import type { Session } from '@/shared/api/auth/authApi';
import localForage from 'localforage';

const SESSIONS_STORAGE_KEY = 'client_trello_session';

export const sessionRepository = {
  loadSession: async () => {
    return (await localForage.getItem<Session>(SESSIONS_STORAGE_KEY)) || undefined;
  },

  saveSession: async (session: Session) => {
    return await localForage.setItem(SESSIONS_STORAGE_KEY, session);
  },

  removeSession: async () => {
    return await localForage.removeItem(SESSIONS_STORAGE_KEY);
  },
};
