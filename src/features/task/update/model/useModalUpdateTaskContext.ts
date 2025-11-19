import { createStrictContext } from '@/shared/lib/react';

export type ContextValue = {
  taskId: string;
  closeModal: () => void;
  isOpen: boolean;
};

export const useModalUpdateTaskContext = createStrictContext<ContextValue>();
