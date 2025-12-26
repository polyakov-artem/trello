import { createStrictContext, useStrictContext } from '@/shared/lib/reactStrictContext';
import type { useModalProps } from '@/shared/ui/Modal/useModalProps';

export type ModalDetails = {
  boardId: string;
};

export type EditBoardContextValue = ReturnType<typeof useModalProps<ModalDetails>>;

export const EditBoardContext = createStrictContext<EditBoardContextValue>();

export const useEditBoardContext = () => {
  return useStrictContext(EditBoardContext);
};
