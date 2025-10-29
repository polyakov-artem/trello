export type EntryState = {
  isLoading: boolean;
  error?: string;
};

export type GetEntryStateParams = Partial<EntryState>;

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

export const getEntryErrorState = (error: string): EntryState => {
  return {
    isLoading: false,
    error,
  };
};

export const getEntryState = ({
  error,
  isLoading,
}: GetEntryStateParams): EntryState | undefined => {
  if (error) {
    return getEntryErrorState(error);
  } else if (isLoading === true) {
    return getEntryLoadingState();
  } else if (isLoading === false) {
    return getEntryInitialState();
  }

  return undefined;
};
