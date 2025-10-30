import { errors } from '../constants/errorMsgs';

export type ErrorInfo = {
  message: string;
  name?: string;
};

export type ApiResponse<T> =
  | { data: T; error?: undefined }
  | { data?: undefined; error: ErrorInfo };

export const getErrorInfo = (error: unknown) => {
  const info: ErrorInfo = {
    message: errors.unexpected,
  };

  if (error instanceof Error) {
    if (error.message) {
      info.message = error.message;
    }

    info.name = error.name;
  }

  return info;
};

export const getResponseData = async <T>(promise: Promise<T>): Promise<ApiResponse<T>> => {
  try {
    const data = await promise;
    return { data };
  } catch (e) {
    return { error: getErrorInfo(e) };
  }
};
