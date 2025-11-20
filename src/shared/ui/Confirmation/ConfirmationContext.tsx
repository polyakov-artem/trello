import { createContext, use } from 'react';
import type { getConfirmation } from './Confirmation';

export type ConfirmationContextValue = {
  getConfirmation: getConfirmation;
};

export const ConfirmationContext = createContext<ConfirmationContextValue>(null!);

export const useConfirmationContext = () => {
  const getConfirmation = use(ConfirmationContext);
  return getConfirmation;
};
