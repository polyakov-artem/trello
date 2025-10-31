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

export type FetchError = {
  name: string;
  message: string;
  status?: number;
  statusText?: string;
};

export type FetchResult<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      error: FetchError;
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
      const errorParsingResult = await parseResponseSafe<
        string | { error?: string; message?: string }
      >(response);

      let msg = '';

      if (errorParsingResult.ok) {
        const parsedError = errorParsingResult.data;

        if (typeof parsedError === 'object' && parsedError !== null) {
          const { error, message } = parsedError as { error?: string; message?: string };

          if (error) {
            msg = error;
          } else if (message) {
            msg = message;
          }
        } else if (typeof parsedError === 'string') {
          msg = parsedError;
        }
      } else {
        msg = `${errorMessages.http}: ${response.status} ${response.statusText || 'Unknown'}`;
      }

      return {
        ok: false,
        error: {
          name: errorNames.http,
          status: response.status,
          statusText: response.statusText,
          message: msg,
        },
      };
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
    let data: T;

    if (typeof parsedData === 'object' && parsedData !== null && 'data' in parsedData) {
      data = parsedData.data as T;
    } else {
      data = parsedData as T;
    }

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
