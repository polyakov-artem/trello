import { createStrictContext, useStrictContext } from '@/shared/lib/reactStrictContext';
import type { ModalProps } from '@/shared/ui/Modal/useModalProps';

export type Details = {
  boardId: string;
  columnId: string;
};

export const CreateColumnTaskContext = createStrictContext<ModalProps<Details>>();

export const useCreateColumnTaskContext = () => {
  return useStrictContext(CreateColumnTaskContext);
};
