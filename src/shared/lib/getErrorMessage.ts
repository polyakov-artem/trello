import { errors } from '../constants/errorMsgs';

export const getErrorMessage = (error: unknown): string => {
  let errorMessage = errors.unexpected;

  if (error instanceof Error && error.message) {
    errorMessage = error.message;
  }

  return errorMessage;
};
