import { createStrictContext, useStrictContext } from '@/shared/lib/reactStrictContext';
import type { useModalProps } from '@/shared/ui/Modal/useModalProps';

export type ModalDetails = {
  taskId: string;
};

export type EditTaskContextValue = ReturnType<typeof useModalProps<ModalDetails>>;

export const EditTaskContext = createStrictContext<EditTaskContextValue>();

export const useEditTaskContext = () => {
  return useStrictContext(EditTaskContext);
};
