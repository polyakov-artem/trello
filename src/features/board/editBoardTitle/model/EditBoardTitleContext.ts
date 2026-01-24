import { createStrictContext, useStrictContext } from '@/shared/lib/reactStrictContext';
import type { useModalProps } from '@/shared/ui/Modal/useModalProps';

export type ModalDetails = {
  boardId: string;
};

export type EditBoardTitleContextValue = ReturnType<typeof useModalProps<ModalDetails>>;

export const EditBoardTitleContext = createStrictContext<EditBoardTitleContextValue>();

export const useEditBoardTitleContext = () => {
  return useStrictContext(EditBoardTitleContext);
};
