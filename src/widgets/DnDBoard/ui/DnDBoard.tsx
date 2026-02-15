import type { Board } from '@/shared/api/board/boardApi';
import type { Task } from '@/shared/types/types';
import type { PropsWithClassName } from '@/shared/types/types';
import clsx from 'clsx';
import { useMemo, type FC } from 'react';
import { DnDColumn } from './DnDColumn';
import { Spinner } from '@/shared/ui/Spinner/Spinner';
import { DeleteOutlined, FileAddOutlined } from '@ant-design/icons';
import { BtnDeleteBoardColumn } from '@/features/board/deleteBoardColumn';
import {
  AddBoardColumnProvider,
  BtnAddBoardColumn,
  ModalAddBoardColumn,
} from '@/features/board/addBoardColumn';
import { EditTaskProvider, ModalEditTask } from '@/features/task/EditTask';
import { BtnCreateTask, CreateTaskProvider, TasksSelectionProvider } from '@/entities/task';
import { ModalCreateTask } from '@/features/task/createTask';
import { ModalCreateColumnTask } from '@/features/board/createColumnTask';
import { UNASSIGNED_TASKS_COLUMN_ID } from '@/entities/board';

export type DnDBoardProps = {
  board: Board;
  isUpdating: boolean;
  unassignedTasksIds: string[];
  tasksMap: Record<string, Task>;
} & PropsWithClassName;

export const DnDBoard: FC<DnDBoardProps> = ({
  className,
  board,
  isUpdating,
  tasksMap,
  unassignedTasksIds,
}) => {
  const classes = useMemo(() => clsx('flex flex-col grow gap-4', className), [className]);

  const columns = useMemo(
    () =>
      board.columns.map((column) => (
        <DnDColumn
          key={column.id}
          title={column.title}
          tasksIds={column.tasksIds}
          tasksMap={tasksMap}
          columnId={column.id}
          actions={
            <>
              <BtnDeleteBoardColumn boardId={board.id} columnId={column.id} size="small">
                <DeleteOutlined />
              </BtnDeleteBoardColumn>
              <BtnCreateTask size="small" columnId={column.id} boardId={board.id}>
                <FileAddOutlined />
              </BtnCreateTask>
            </>
          }
        />
      )),
    [board, tasksMap]
  );

  const validValuesByPath = useMemo(() => {
    const result: Record<string, string[]> = {};

    for (const column of board.columns) {
      result[column.id] = column.tasksIds;
    }

    result[UNASSIGNED_TASKS_COLUMN_ID] = unassignedTasksIds;

    return result;
  }, [board.columns, unassignedTasksIds]);

  return (
    <TasksSelectionProvider validValuesByPath={validValuesByPath}>
      <EditTaskProvider>
        <div className={classes}>
          <AddBoardColumnProvider>
            <BtnAddBoardColumn className="self-end" boardId={board.id} />
            <ModalAddBoardColumn />
          </AddBoardColumnProvider>
          <div className="grow grid grid-cols-[300px_1fr] gap-2 relative">
            <div className="bg-gray-100 rounded-md p-2 flex">
              <CreateTaskProvider>
                <DnDColumn
                  key={UNASSIGNED_TASKS_COLUMN_ID}
                  columnId={UNASSIGNED_TASKS_COLUMN_ID}
                  className="grow"
                  title={'Unassigned tasks'}
                  tasksIds={unassignedTasksIds}
                  tasksMap={tasksMap}
                  actions={
                    <BtnCreateTask size="small">
                      <FileAddOutlined />
                    </BtnCreateTask>
                  }
                />
                <ModalCreateTask />
              </CreateTaskProvider>
            </div>
            <div className="bg-gray-100 rounded-md p-2 grid grid-cols-4 gap-2 ">
              <CreateTaskProvider>
                {columns}
                <ModalCreateColumnTask />
              </CreateTaskProvider>
            </div>
            {isUpdating && <Spinner onTopMode withOverlay whiteOverlay />}
          </div>
        </div>
        <ModalEditTask />
      </EditTaskProvider>
    </TasksSelectionProvider>
  );
};
