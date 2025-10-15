import { createContext, use } from 'react';
import type { getConfirmation } from './ConfirmationProvider';

export type ConfirmationContextValue = {
  getConfirmation: getConfirmation;
};

export const ConfirmationContext = createContext<ConfirmationContextValue>(null!);

export const useConfirmation = () => {
  const getConfirmation = use(ConfirmationContext);
  return getConfirmation;
};
