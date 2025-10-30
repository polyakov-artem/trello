import { delay } from '@/shared/lib/delay';

import { nanoid } from 'nanoid';
import { loadUsers } from './serverUserApi';
import localForage from 'localforage';

export type Session = {
  sessionId: string;
  userId: string;
};

export type Sessions = Record<string, Session>;
export type LoginResponse = Session;

const SESSIONS_STORAGE_KEY = 'server_trello_sessions';
const ERROR_FAILED_TO_LOGIN_WITH_USER_DATA = 'Failed to login with user data';
const ERROR_FAILED_TO_LOGIN_WITH_SESSION_DATA = 'Failed to login with session data';

export const serverAuthApi = {
  async loginWithUserId(userId: string): Promise<LoginResponse> {
    await delay(500);

    const users = await loadUsers();
    const user = users.find((u) => u.id === userId);

    if (!user) {
      throw new Error(ERROR_FAILED_TO_LOGIN_WITH_USER_DATA);
    }

    const sessions = await loadSessions();
    const id = nanoid();
    const newSession: Session = { sessionId: id, userId };
    await saveSessions({ ...sessions, [id]: newSession });

    return newSession;
  },

  async loginWithSessionId(sessionId: string): Promise<LoginResponse> {
    await delay(500);

    const sessions = await loadSessions();
    const session = sessions[sessionId];

    if (!session) {
      throw new Error(ERROR_FAILED_TO_LOGIN_WITH_SESSION_DATA);
    }

    const users = await loadUsers();
    const user = users.find((u) => u.id === session.userId);

    if (!user) {
      throw new Error(ERROR_FAILED_TO_LOGIN_WITH_USER_DATA);
    }

    const response = { sessionId, userId: user.id };

    return response;
  },

  async logout(sessionId: string): Promise<boolean> {
    await delay(500);

    const sessions = await loadSessions();
    delete sessions[sessionId];
    await saveSessions(sessions);
    return true;
  },
};

export const loadSessions = async () => {
  return (await localForage.getItem<Sessions>(SESSIONS_STORAGE_KEY)) || {};
};

export const saveSessions = async (sessions: Sessions) => {
  return await localForage.setItem(SESSIONS_STORAGE_KEY, sessions);
};
