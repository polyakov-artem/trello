import { create } from 'zustand';
import { createSelectors } from '@/shared/lib/zustand';
import type { User } from '@/shared/api/user/userApi';
import {
  getEntryInitialState,
  getEntryState,
  type EntryState,
  type GetEntryStateParams,
} from '@/entities/storeUtils';

export type UsersStoreState = {
  users: User[];
  usersState: EntryState;
  setUsers: (users: User[]) => void;
  setUsersState: (value: GetEntryStateParams) => void;
  addUser: (user: User) => void;
  removeUser: (id: string) => void;
  checkIfCreatingUser: () => boolean;
  checkIfLoadingUsers: () => boolean;

  creationState: EntryState;
  setCreationState: (value: GetEntryStateParams) => void;

  deletionQueue: Record<string, boolean>;
  addToDeletionQueue: (id: string) => void;
  removeFromDeletionQueue: (id: string) => void;
  checkIfRemovingUserWithId: (id: string) => boolean;
};

export const useUsersStoreBase = create<UsersStoreState>((set, get) => ({
  users: [],
  usersState: getEntryInitialState(),

  setUsers: (users: User[]) => {
    set({ users });
  },

  setUsersState: (props: GetEntryStateParams) => {
    const nextState = getEntryState(props);
    if (nextState) {
      set({ usersState: nextState });
    }
  },

  addUser: (user: User) => {
    set({ users: [...get().users, user] });
  },

  removeUser: (id: string) => {
    set({ users: get().users.filter((u) => u.id !== id) });
  },

  checkIfLoadingUsers: () => {
    return get().usersState.isLoading;
  },

  creationState: getEntryInitialState(),
  setCreationState: (props: GetEntryStateParams) => {
    const nextState = getEntryState(props);
    if (nextState) {
      set({ creationState: nextState });
    }
  },

  checkIfCreatingUser: () => {
    return get().creationState.isLoading;
  },

  deletionQueue: {},

  addToDeletionQueue: (id: string) => {
    const deletionQueue = { ...get().deletionQueue };
    deletionQueue[id] = true;
    set({ deletionQueue });
  },

  removeFromDeletionQueue: (id: string) => {
    const deletionQueue = { ...get().deletionQueue };
    delete deletionQueue[id];
    set({ deletionQueue });
  },

  checkIfRemovingUserWithId: (id: string) => {
    return !!get().deletionQueue[id];
  },
}));

export const useUsersStore = createSelectors(useUsersStoreBase);
