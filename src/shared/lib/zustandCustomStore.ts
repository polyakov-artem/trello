import type { FetchError } from './safeFetch';
import { create } from 'zustand';
import { createSelectors } from './zustandUtils.ts';

export type CancelRef = {
  cancel: undefined | (() => void);
};

export type SetCancelRef = (cancelFn: CancelRef['cancel']) => void;

export type CustomStoreState<T = unknown> = {
  value: T;
  isLoading: boolean;
  error: FetchError | undefined;
  cancelRef: CancelRef;
  setState: {
    (
      partial:
        | CustomStoreState<T>
        | Partial<CustomStoreState<T>>
        | ((state: CustomStoreState<T>) => CustomStoreState<T> | Partial<CustomStoreState<T>>),
      replace?: false
    ): void;
    (
      state: CustomStoreState<T> | ((state: CustomStoreState<T>) => CustomStoreState<T>),
      replace: true
    ): void;
  };

  getState: () => CustomStoreState<T>;
  setCancelRef: SetCancelRef;
  cancelRequest: () => void;
  reset: () => void;
};

export const createBaseInitialState = <T>(initialValue: T) => ({
  value: initialValue,
  isLoading: false,
  error: undefined,
});

export const createCustomStore = <T>(initialValue: T) =>
  createSelectors(
    create<CustomStoreState<T>>((set, get) => ({
      ...createBaseInitialState<T>(initialValue),
      cancelRef: { cancel: undefined },
      setState: set,
      getState: get,
      setCancelRef: (cancelFn) => set({ cancelRef: { cancel: cancelFn } }),
      cancelRequest: () => get().cancelRef?.cancel?.(),
      reset: () => {
        get().cancelRequest();
        set(createBaseInitialState<T>(initialValue));
        get().setCancelRef(undefined);
      },
    }))
  );
