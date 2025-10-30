import { delay } from '@/shared/lib/delay';
import { nanoid } from 'nanoid';
import localForage from 'localforage';
import { loadSessions } from './serverAuthApi';

export type User = {
  id: string;
  name: string;
  avatarId: string;
};

export type UserWithoutId = Omit<User, 'id'>;

const USERS_STORAGE_KEY = 'server_trello_users';
const ERROR_USER_LOADING_FAILED = 'Failed to load user';

export const serverUserApi = {
  async registerUser(user: UserWithoutId): Promise<User> {
    await delay(500);

    const users = await loadUsers();
    const newUser = { ...user, id: nanoid() };
    users.push(newUser);
    await saveUsers(users);
    return newUser;
  },

  async removeUser(id: string): Promise<void> {
    await delay(500);

    const users = await loadUsers();
    await saveUsers(users.filter((u) => u.id !== id));
  },

  async getUsers(): Promise<User[]> {
    await delay(500);

    return loadUsers();
  },

  async getUserById(userId: string, sessionId: string): Promise<User> {
    await delay(500);

    const sessions = await loadSessions();
    const session = sessions[sessionId];

    if (!session) {
      throw new Error(ERROR_USER_LOADING_FAILED);
    }

    const users = await loadUsers();
    const user = users.find((u) => u.id === userId);

    if (!user || userId !== session.userId) {
      throw new Error(ERROR_USER_LOADING_FAILED);
    }

    return user;
  },
};

export const loadUsers = async () => {
  return (await localForage.getItem<User[]>(USERS_STORAGE_KEY)) || [];
};

export const saveUsers = async (users: User[]) => {
  return await localForage.setItem(USERS_STORAGE_KEY, users);
};
