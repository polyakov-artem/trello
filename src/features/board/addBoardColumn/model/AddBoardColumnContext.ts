import { createStrictContext, useStrictContext } from '@/shared/lib/reactStrictContext';
import type { ModalProps } from '@/shared/ui/Modal/useModalProps';

export type Details = {
  boardId: string;
};

export const AddBoardColumnContext = createStrictContext<ModalProps<Details>>();

export const useAddBoardColumnContext = () => {
  return useStrictContext(AddBoardColumnContext);
};
