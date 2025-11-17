export const errorNames = {
  http: 'HttpError',
  parse: 'ParseError',
  network: 'NetworkError',
  unknown: 'UnknownError',
  aborted: 'AbortError',
} as const;

export const errorMessages = {
  http: 'HTTP error',
  parse: 'Failed to parse response data',
  network: 'Network error: Failed to fetch (check connectivity/CORS)',
  unknown: 'Unknown error occurred',
  aborted: 'The operation was canceled by the user',
} as const;

export type FieldError = {
  field: string;
  message: string;
};

export type FetchError = {
  name: string;
  message: string;
  status?: number;
  statusText?: string;
  errors?: FieldError[];
};

export type ServerResponse<T> = {
  data?: T;
  errors?: FieldError[];
  error?: string;
};

export type ResultWithData<T> = {
  ok: true;
  data: T;
};

export type ResultWithError = {
  ok: false;
  error: FetchError;
};

export type FetchResult<T> = ResultWithData<T> | ResultWithError;

export const isObject = (value: unknown): value is object =>
  typeof value === 'object' && value !== null;

export const isFetchError = (value: unknown): value is FetchError =>
  isObject(value) &&
  'name' in value &&
  typeof value.name === 'string' &&
  'message' in value &&
  typeof value.message === 'string';

export const isResultWithError = (obj: unknown): obj is ResultWithError => {
  return (
    isObject(obj) && 'ok' in obj && obj.ok === false && 'error' in obj && isFetchError(obj.error)
  );
};

export const isResultWithData = <T>(obj: unknown): obj is ResultWithData<T> => {
  return isObject(obj) && 'ok' in obj && obj.ok === true && 'data' in obj;
};

export function isNoContent(response: Response) {
  if (response.status === 204 || response.status === 205) return true;
  const contentLength = response.headers.get('content-length');
  if (contentLength !== null && Number(contentLength) === 0) return true;
  const contentType = response.headers.get('content-type') || '';
  // If clearly non-JSON and no content-length, we avoid forcing JSON parsing
  if (!contentType && response.ok) return true;
  return false;
}

export const createResultWithData = <T>(value: T) => ({ ok: true, data: value }) as const;

export async function parseResponseSafe<T>(
  response: Response
): Promise<{ ok: true; data: T } | { ok: false }> {
  const errorResult = { ok: false } as const;

  if (isNoContent(response)) {
    return errorResult;
  }

  const contentType = (response.headers.get('Content-Type') || '').toLowerCase();

  try {
    if (contentType.includes('application/json') || contentType.endsWith('+json')) {
      const value = (await response.json()) as T;
      return createResultWithData(value);
    }

    if (contentType.includes('multipart/form-data')) {
      const value = (await response.formData()) as T;
      return createResultWithData(value);
    }

    if (
      contentType.startsWith('image/') ||
      contentType === 'application/pdf' ||
      contentType.includes('octet-stream') ||
      contentType.includes('zip') ||
      contentType.includes('tar') ||
      contentType.includes('/vnd')
    ) {
      const value = (await response.blob()) as T;
      return createResultWithData(value);
    }

    return errorResult;
  } catch {
    return errorResult;
  }
}

export async function safeFetch<T>(url: string, options?: RequestInit): Promise<FetchResult<T>> {
  try {
    const response = await fetch(url, options);

    // Non-OK HTTP responses
    if (!response.ok) {
      const errorParsingResult = await parseResponseSafe<ServerResponse<T>>(response);

      const errorResult: FetchResult<T> = {
        ok: false as const,
        error: {
          name: errorNames.http,
          status: response.status,
          statusText: response.statusText,
          message: `${errorMessages.http}: ${response.status} ${response.statusText || 'Unknown'}`,
        },
      };

      if (errorParsingResult.ok) {
        const { error, errors } = errorParsingResult.data;

        const hasErrorMsg = typeof error === 'string' && !!error;
        const hasFieldsErrors = Array.isArray(errors) && !!errors.length;

        if (hasErrorMsg) {
          errorResult.error.message = error;
        }

        if (hasFieldsErrors) {
          errorResult.error.errors = errors;
        }
      }

      return errorResult;
    }

    // OK responses
    if (isNoContent(response)) {
      return createResultWithData(undefined as T);
    }

    const dataParsingResult = await parseResponseSafe(response);

    if (!dataParsingResult.ok) {
      return {
        ok: false,
        error: {
          name: errorNames.parse,
          message: errorMessages.parse,
          status: response.status,
        },
      };
    }

    const parsedData = dataParsingResult.data;
    const data =
      typeof parsedData === 'object' && parsedData !== null && 'data' in parsedData
        ? (parsedData.data as T)
        : (parsedData as T);

    return createResultWithData(data);
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          ok: false,
          error: {
            name: errorNames.aborted,
            message: errorMessages.aborted,
          },
        };
      }

      return {
        ok: false,
        error: {
          name: errorNames.network,
          message: errorMessages.network,
          status: 0,
        },
      };
    }

    return {
      ok: false,
      error: {
        name: errorNames.unknown,
        message: errorMessages.unknown,
      },
    };
  }
}
