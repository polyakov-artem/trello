import type { Session } from '@/shared/api/auth/authApi';

const SESSIONS_STORAGE_KEY = 'client_trello_session';

export const sessionRepository = {
  loadSession: () => {
    const dataRaw = localStorage.getItem(SESSIONS_STORAGE_KEY);

    if (dataRaw) {
      try {
        return JSON.parse(dataRaw) as Session;
      } catch {
        // ignore
      }
    }

    return null;
  },

  saveSession: (session: Session) => {
    return localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(session));
  },

  removeSession: () => {
    return localStorage.removeItem(SESSIONS_STORAGE_KEY);
  },
};
