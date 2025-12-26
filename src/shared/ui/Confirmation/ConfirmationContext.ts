import { createStrictContext, useStrictContext } from '@/shared/lib/reactStrictContext';

export type Details = { title?: string; body?: React.ReactNode };
export type GetConfirmation = (props?: Details) => Promise<boolean>;

export type ConfirmationContextValue = {
  details: Details | undefined;
  isOpen: boolean;
  closeModal: () => void;
  confirm: () => void;
  getConfirmation: GetConfirmation;
  onCloseComplete: () => void;
};

export const ConfirmationContext = createStrictContext<ConfirmationContextValue>();

export const useConfirmationContext = () => {
  return useStrictContext(ConfirmationContext);
};
