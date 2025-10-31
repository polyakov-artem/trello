import type { FetchError } from '@/shared/lib/safeFetch';

export type EntryState = {
  isLoading: boolean;
  error?: FetchError;
};

export type GetEntryStateParams = boolean | FetchError;

export const getEntryInitialState = (): EntryState => {
  return {
    isLoading: false,
    error: undefined,
  };
};

export const getEntryLoadingState = (): EntryState => {
  return {
    isLoading: true,
    error: undefined,
  };
};

export const getEntryErrorState = (error: FetchError): EntryState => {
  return {
    isLoading: false,
    error,
  };
};

export const getEntryState = (value: boolean | FetchError): EntryState | undefined => {
  if (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    typeof value.message === 'string'
  ) {
    return getEntryErrorState(value);
  } else if (value === true) {
    return getEntryLoadingState();
  } else if (value === false) {
    return getEntryInitialState();
  }

  return undefined;
};
