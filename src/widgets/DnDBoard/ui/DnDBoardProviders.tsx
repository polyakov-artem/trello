import { TaskLocationMapProvider, TasksMapProvider, TasksSelectionProvider } from '@/entities/task';
import { TasksByColumnIdMapProvider } from '@/entities/task';
import { EditTaskProvider, ModalEditTask } from '@/features/task/EditTask';
import type { FC, PropsWithChildren } from 'react';
import { AddBoardColumnProvider, ModalAddBoardColumn } from '@/features/board/addBoardColumn';
import { CreateColumnTaskProvider, ModalCreateColumnTask } from '@/features/board/createColumnTask';
import { DnDProvider } from '@/features/board/moveTaskAndColumns';

export const DnDBoardProviders: FC<PropsWithChildren> = ({ children }) => {
  return (
    <DnDProvider>
      <TasksByColumnIdMapProvider>
        <TaskLocationMapProvider>
          <EditTaskProvider>
            <TasksSelectionProvider>
              <TasksMapProvider>
                <AddBoardColumnProvider>
                  <CreateColumnTaskProvider>
                    {children}
                    <ModalCreateColumnTask />
                  </CreateColumnTaskProvider>
                  <ModalAddBoardColumn />
                </AddBoardColumnProvider>
              </TasksMapProvider>
            </TasksSelectionProvider>
            <ModalEditTask />
          </EditTaskProvider>
        </TaskLocationMapProvider>
      </TasksByColumnIdMapProvider>
    </DnDProvider>
  );
};
