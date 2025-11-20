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

  setIsLoading: (value: boolean) => void;
  setError: (error: FetchError | undefined) => void;
  setValue: (value: T) => void;
  setCancelRef: SetCancelRef;
  setState: (
    value:
      | Partial<CustomStoreState<T>>
      | ((prevState: CustomStoreState<T>) => Partial<CustomStoreState<T>>)
  ) => void;

  getValue: () => T;
  getError: () => FetchError | undefined;
  checkIfLoading: () => boolean;
  getCancelRef: () => CancelRef | undefined;

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

      setIsLoading: (value) => set({ isLoading: value }),
      setError: (error) => set({ error }),
      setValue: (value) => set({ value }),
      setCancelRef: (cancelFn) => {
        get().cancelRef.cancel = cancelFn;
      },
      setState: (value) => {
        if (typeof value === 'function') {
          set(value(get()));
        } else {
          set(value);
        }
      },

      getValue: () => get().value,
      getError: () => get().error,
      checkIfLoading: () => get().isLoading,
      cancelRequest: () => get().cancelRef?.cancel?.(),

      getCancelRef: () => get().cancelRef,
      reset: () => {
        get().cancelRequest();
        set(createBaseInitialState<T>(initialValue));
        get().setCancelRef(undefined);
      },
    }))
  );
