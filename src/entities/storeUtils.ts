export type EntryState = {
  isLoading: boolean;
  error?: string;
};

export type GetEntryStateParams = Partial<EntryState>;

export const getEntryInitialState = () => {
  return {
    isLoading: false,
    error: '',
  };
};

export const getEntryLoadingState = () => {
  return {
    isLoading: true,
    error: '',
  };
};

export const getEntryErrorState = (error: string) => {
  return {
    isLoading: false,
    error,
  };
};

export const getEntryState = ({ error, isLoading }: GetEntryStateParams) => {
  if (error) {
    return getEntryErrorState(error);
  } else if (isLoading === true) {
    return getEntryLoadingState();
  } else if (isLoading === false) {
    return getEntryInitialState();
  }
};
