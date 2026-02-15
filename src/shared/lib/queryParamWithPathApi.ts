import { useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router';

// For query params like ?selTasks=A|B|C|1,2;C|D|E|3, where tasks 1,2 can be found by path A|B|C and tasks 3,4 can be found by path D|E|E.

type SelectionMap = Map<string, Set<string>>;
// key = serializedPath (A|B|C)
// value = Set of ids

const GROUPS_SEPARATOR = ';';
const PATH_SEPARATOR = '|';
const VALUES_SEPARATOR = ',';

const parseGroupedParam = (paramName: string, params: URLSearchParams): SelectionMap => {
  const raw = params.get(paramName);
  const result: SelectionMap = new Map();

  if (!raw) return result;

  const groups = raw.split(GROUPS_SEPARATOR).filter(Boolean);

  for (const group of groups) {
    const parts = group.split(PATH_SEPARATOR).filter(Boolean);
    const hasNoPathOrValue = parts.length < 2;

    if (hasNoPathOrValue) continue;

    const valuesRaw = parts.at(-1)!;
    const pathParts = parts.slice(0, -1);

    const pathKey = pathParts.join(PATH_SEPARATOR);
    const values = valuesRaw.split(VALUES_SEPARATOR).filter(Boolean);

    if (values.length === 0) continue;

    result.set(pathKey, new Set(values));
  }

  return result;
};

const serializeGroupedParam = (map: SelectionMap): string => {
  const groups: string[] = [];

  for (const [pathKey, valuesSet] of map.entries()) {
    if (valuesSet.size === 0) continue;

    groups.push(`${pathKey}${PATH_SEPARATOR}${[...valuesSet].join(VALUES_SEPARATOR)}`);
  }

  return groups.join(GROUPS_SEPARATOR);
};

export const useQueryParamApiWithAutoClean = (
  paramName: string,
  validValuesByPath: Record<string, string[]>
) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentMap = useMemo(() => {
    return parseGroupedParam(paramName, searchParams);
  }, [paramName, searchParams]);

  const updateParams = useCallback(
    (nextMap: SelectionMap, addToHistory: boolean) => {
      const nextParams = new URLSearchParams(searchParams);

      if (nextMap.size === 0) {
        nextParams.delete(paramName);
      } else {
        nextParams.set(paramName, serializeGroupedParam(nextMap));
      }

      setSearchParams(nextParams, { replace: !addToHistory });
    },
    [paramName, searchParams, setSearchParams]
  );

  const addValues = useCallback(
    (path: string[], ids: string[], addToHistory: boolean) => {
      const pathKey = path.join(PATH_SEPARATOR);
      const nextMap = new Map(currentMap);

      const existing = nextMap.get(pathKey) ?? new Set<string>();
      const nextSet = new Set(existing);

      ids.forEach((id) => nextSet.add(id));
      nextMap.set(pathKey, nextSet);

      updateParams(nextMap, addToHistory);
    },
    [currentMap, updateParams]
  );

  const removeValues = useCallback(
    (path: string[], ids: string[], addToHistory: boolean) => {
      const pathKey = path.join(PATH_SEPARATOR);
      const nextMap = new Map(currentMap);

      const existing = nextMap.get(pathKey);
      if (!existing) return;

      const nextSet = new Set(existing);
      ids.forEach((id) => nextSet.delete(id));

      if (nextSet.size === 0) {
        nextMap.delete(pathKey);
      } else {
        nextMap.set(pathKey, nextSet);
      }

      updateParams(nextMap, addToHistory);
    },
    [currentMap, updateParams]
  );

  const exists = useCallback(
    (path: string[], ids: string[]) => {
      const pathKey = path.join(PATH_SEPARATOR);
      const set = currentMap.get(pathKey);
      if (!set) return false;
      return ids.every((id) => set.has(id));
    },
    [currentMap]
  );

  const toggleValues = useCallback(
    (path: string[], ids: string[], addToHistory: boolean) => {
      const allExist = exists(path, ids);

      if (allExist) {
        removeValues(path, ids, addToHistory);
      } else {
        addValues(path, ids, addToHistory);
      }
    },
    [exists, removeValues, addValues]
  );

  useEffect(() => {
    if (currentMap.size === 0) return;

    const nextMap: SelectionMap = new Map();
    let changed = false;

    for (const [pathKey, valuesSet] of currentMap.entries()) {
      const validValues = validValuesByPath[pathKey];

      if (!validValues) {
        changed = true;
        continue;
      }

      const validSet = new Set(validValues);
      const cleaned = new Set([...valuesSet].filter((v) => validSet.has(v)));

      if (cleaned.size === 0) {
        changed = true;
        continue;
      }

      if (cleaned.size !== valuesSet.size) {
        changed = true;
      }

      nextMap.set(pathKey, cleaned);
    }

    if (changed) {
      updateParams(nextMap, false);
    }
  }, [currentMap, validValuesByPath, updateParams]);

  return {
    currentMap,
    addValues,
    removeValues,
    toggleValues,
    exists,
  };
};
