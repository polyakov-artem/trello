import { createStrictContext, useStrictContext } from '@/shared/lib/reactStrictContext';
import type { useModalProps } from '@/shared/ui/Modal/useModalProps';

export type ModalDetails = {
  taskId: string;
};

export type UpdateTaskContextValue = ReturnType<typeof useModalProps<ModalDetails>>;

export const UpdateTaskContext = createStrictContext<UpdateTaskContextValue>();

export const useUpdateTaskContext = () => {
  return useStrictContext(UpdateTaskContext);
};
