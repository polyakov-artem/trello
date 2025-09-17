import { ERROR_TITLES } from '../constants/errorMsgs';

export const getErrorMessage = (error: unknown): string => {
  let errorMessage = ERROR_TITLES.UNEXPECTED;

  if (error instanceof Error && error.message) {
    errorMessage = error.message;
  }

  return errorMessage;
};
