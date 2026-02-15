// Values are separated by semicolon in query param, for example: ?ids=1;2;3

import { useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router';

const convertSetToValue = (set: Set<string>): string => {
  return Array.from(set).join(';');
};

const queryStringToSet = (paramName: string, params: URLSearchParams) => {
  const raw = params.get(paramName);
  if (!raw) return new Set<string>();
  return new Set(raw.split(';').filter(Boolean));
};

export const useQueryParamApi = (paramName: string) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentSet = useMemo(() => {
    return queryStringToSet(paramName, searchParams);
  }, [paramName, searchParams]);

  const updateParams = useCallback(
    (nextSet: Set<string>, addToHistory: boolean) => {
      const nextParams = new URLSearchParams(searchParams);

      if (nextSet.size === 0) {
        nextParams.delete(paramName);
      } else {
        nextParams.set(paramName, convertSetToValue(nextSet));
      }

      setSearchParams(nextParams, { replace: !addToHistory });
    },
    [paramName, searchParams, setSearchParams]
  );

  const addValues = useCallback(
    (values: string[], addToHistory: boolean) => {
      const nextSet = new Set(currentSet);

      for (const v of values) {
        nextSet.add(v);
      }

      updateParams(nextSet, addToHistory);
    },
    [currentSet, updateParams]
  );

  const removeValues = useCallback(
    (values: string[], addToHistory: boolean) => {
      const nextSet = new Set(currentSet);

      for (const v of values) {
        nextSet.delete(v);
      }
      updateParams(nextSet, addToHistory);
    },
    [currentSet, updateParams]
  );

  const exists = useCallback(
    (values: string[]) => {
      return values.every((v) => currentSet.has(v));
    },
    [currentSet]
  );

  const toggleValues = useCallback(
    (values: string[], addToHistory: boolean) => {
      const allExists = exists(values);

      if (allExists) {
        removeValues(values, addToHistory);
      } else {
        addValues(values, addToHistory);
      }
    },
    [exists, removeValues, addValues]
  );

  return {
    addValues,
    removeValues,
    toggleValues,
    exists,
    currentSet,
  };
};

export const useQueryParamApiWithAutoClean = (paramName: string, validValues: string[]) => {
  const queryParamApi = useQueryParamApi(paramName);
  const { currentSet, removeValues } = queryParamApi;

  const validSet = useMemo(() => new Set(validValues), [validValues]);

  useEffect(() => {
    if (currentSet.size === 0) return;

    const invalidIds = Array.from(currentSet).filter((id) => !validSet.has(id));

    if (invalidIds.length === 0) return;

    removeValues(invalidIds, false);
  }, [currentSet, validSet, removeValues]);

  return queryParamApi;
};
