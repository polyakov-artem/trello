import { CreateColumnTaskProvider, ModalCreateColumnTask } from '@/features/board/createColumnTask';
import { EditTaskProvider, ModalEditTask } from '@/features/task/EditTask';
import type { FC, PropsWithChildren } from 'react';
import { AddBoardColumnProvider, ModalAddBoardColumn } from '@/features/board/addBoardColumn';

export const DnDBoardProvidersWithModals: FC<PropsWithChildren> = ({ children }) => {
  return (
    <EditTaskProvider>
      <CreateColumnTaskProvider>
        <AddBoardColumnProvider>
          {children}
          <ModalAddBoardColumn />
        </AddBoardColumnProvider>
        <ModalCreateColumnTask />
      </CreateColumnTaskProvider>
      <ModalEditTask />
    </EditTaskProvider>
  );
};
