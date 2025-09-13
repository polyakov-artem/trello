import { ERROR_MSGS } from '../constants/errorMsgs';

export const getErrorMessage = (error: unknown): string => {
  let errorMessage = ERROR_MSGS.UNEXPECTED;

  if (error instanceof Error && error.message) {
    errorMessage = error.message;
  }

  return errorMessage;
};
