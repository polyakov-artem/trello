import type { Board, BoardColumn } from '@/shared/api/board/boardApi';
import { createStrictContext, useStrictContext } from '@/shared/lib/reactStrictContext';
import type { useModalProps } from '@/shared/ui/Modal/useModalProps';

export type ModalDetails = {
  board: Board;
  column: BoardColumn;
};

export const AddColumnTaskContext =
  createStrictContext<ReturnType<typeof useModalProps<ModalDetails>>>();

export const useAddColumnTaskContext = () => {
  return useStrictContext(AddColumnTaskContext);
};
