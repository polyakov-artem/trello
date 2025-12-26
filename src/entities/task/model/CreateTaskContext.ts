import { createStrictContext, useStrictContext } from '@/shared/lib/reactStrictContext';
import type { ModalProps } from '@/shared/ui/Modal/useModalProps';

export type Details = {
  boardId?: string;
  columnId?: string;
};

export const CreateTaskContext = createStrictContext<ModalProps<Details>>();

export const useCreateTaskContext = () => {
  return useStrictContext(CreateTaskContext);
};
