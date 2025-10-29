import {
  getEntryInitialState,
  getEntryState,
  type EntryState,
  type GetEntryStateParams,
} from '@/entities/storeUtils';
import { create } from 'zustand';
import type { Session } from './types';
import { createSelectors } from '@/shared/lib/zustand';
import type { User } from '@/shared/api/user/userApi';

export type SessionStoreState = {
  session: Session | undefined;
  sessionState: EntryState;
  setSession: (session: Session | undefined) => void;
  setSessionState: (value: GetEntryStateParams) => void;
  checkIfLoadingSession: () => boolean;
  checkIfActiveSession: () => boolean;
  getSessionId: () => string | undefined;

  sessionUser: User | undefined;
  sessionUserState: EntryState;
  setSessionUser: (user: User | undefined) => void;
  setSessionUserState: (value: GetEntryStateParams) => void;
  checkIfLoadingSessionUser: () => boolean;
};

export const useSessionStoreBase = create<SessionStoreState>((set, get) => ({
  session: undefined,
  sessionState: getEntryInitialState(),

  setSession: (session) => {
    set({ session });
  },

  setSessionState: (value) => {
    const nextState = getEntryState(value);
    if (nextState) {
      set({ sessionState: nextState });
    }
  },

  checkIfLoadingSession: () => {
    return get().sessionState.isLoading;
  },

  checkIfActiveSession: () => {
    return !!get().session;
  },

  sessionUser: undefined,
  sessionUserState: getEntryInitialState(),

  setSessionUser: (sessionUser) => {
    set({ sessionUser });
  },

  setSessionUserState: (props) => {
    const nextState = getEntryState(props);
    if (nextState) {
      set({ sessionUserState: nextState });
    }
  },

  checkIfLoadingSessionUser: () => {
    return get().sessionUserState.isLoading;
  },

  getSessionId: () => {
    return get().session?.sessionId;
  },
}));

export const useSessionStore = createSelectors(useSessionStoreBase);
