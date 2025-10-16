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
  sessionUser?: User;
  sessionUserState: EntryState;
  setSessionUser: (user: User) => void;
  setSessionUserState: (value: GetEntryStateParams) => void;

  users: User[];
  usersState: EntryState;
  setUsers: (users: User[]) => void;
  setUsersState: (value: GetEntryStateParams) => void;
  addUser: (user: User) => void;
  removeUser: (id: string) => void;
  checkIfAddingUser: () => boolean;
  isLoadingUsersFn: () => boolean;

  addingState: EntryState;
  setAddingState: (value: GetEntryStateParams) => void;

  deletionQueue: Record<string, boolean>;
  addToDeletionQueue: (id: string) => void;
  removeFromDeletionQueue: (id: string) => void;
  checkIfRemovingUserWithId: (id: string) => boolean;
};

export const useUsersStoreBase = create<UsersStoreState>((set, get) => ({
  sessionUser: undefined,
  sessionUserState: getEntryInitialState(),

  setSessionUser: (sessionUser?: User) => {
    set({ sessionUser });
  },

  setSessionUserState: (props: GetEntryStateParams) => {
    const nexState = getEntryState(props);
    if (nexState) {
      set({ sessionUserState: nexState });
    }
  },

  users: [],
  usersState: getEntryInitialState(),

  setUsers: (users: User[]) => {
    set({ users });
  },

  setUsersState: (props: GetEntryStateParams) => {
    const nexState = getEntryState(props);
    if (nexState) {
      set({ usersState: nexState });
    }
  },

  addUser: (user: User) => {
    set({ users: [...get().users, user] });
  },

  removeUser: (id: string) => {
    set({ users: get().users.filter((u) => u.id !== id) });
  },

  isLoadingUsersFn: () => {
    return get().usersState.isLoading;
  },

  addingState: getEntryInitialState(),
  setAddingState: (props: GetEntryStateParams) => {
    const nexState = getEntryState(props);
    if (nexState) {
      set({ addingState: nexState });
    }
  },

  checkIfAddingUser: () => {
    return get().addingState.isLoading;
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
