import type { FetchError } from './safeFetch';
import { create } from 'zustand';
import { createSelectors } from './zustandUtils.ts';

export type CancelReqFn = undefined | (() => void);
export type SetCancelReqFn = (cancelReqFn: CancelReqFn) => void;

export type CustomStoreState<T = unknown> = {
  value: T;
  isLoading: boolean;
  error: FetchError | undefined;
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
  setCancelReqFn: SetCancelReqFn;
  cancelRequest: () => void;
  reset: () => void;
};

export const createBaseInitialState = <T>(initialValue: T) => ({
  value: initialValue,
  isLoading: false,
  error: undefined,
});

export const createCancelReqControls = () => {
  let cancelFn: CancelReqFn;

  return {
    setCancelReqFn: (cancelReqFn: CancelReqFn) => {
      cancelFn?.();
      cancelFn = cancelReqFn;
    },
    cancelRequest: () => {
      cancelFn?.();
      cancelFn = undefined;
    },
  };
};

export const createCustomStore = <T>(initialValue: T) => {
  const { setCancelReqFn, cancelRequest } = createCancelReqControls();

  return createSelectors(
    create<CustomStoreState<T>>((set, get) => ({
      ...createBaseInitialState<T>(initialValue),
      setState: set,
      getState: get,
      setCancelReqFn,
      cancelRequest,
      reset: () => {
        get().cancelRequest();
        set(createBaseInitialState<T>(initialValue));
        get().setCancelReqFn(undefined);
      },
    }))
  );
};
