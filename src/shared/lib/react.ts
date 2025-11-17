import { createContext, use, type Context } from 'react';

export function createStrictContext<T>() {
  return createContext<T | null>(null);
}

export function useStrictContext<T>(context: Context<T | null>) {
  const value = use(context);
  if (value === null) throw new Error('Strict context not passed');
  return value as T;
}
