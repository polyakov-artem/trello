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
import { BtnCreateTask, CreateTaskProvider } from '@/entities/task';
import { ModalCreateTask } from '@/features/task/createTask';
import { ModalCreateColumnTask } from '@/features/board/createColumnTask';

export type DnDBoardProps = {
  board: Board;
  tasks: Task[];
  isUpdating: boolean;
  unassignedTasks: Task[];
} & PropsWithClassName;

export const DnDBoard: FC<DnDBoardProps> = ({
  className,
  board,
  tasks,
  isUpdating,
  unassignedTasks,
}) => {
  const classes = useMemo(() => clsx('flex flex-col grow gap-4', className), [className]);

  const columns = useMemo(
    () =>
      board.columns.map((column) => (
        <DnDColumn
          key={column.id}
          title={column.title}
          tasks={tasks.filter((task) => column.tasksIds.includes(task.id))}
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
    [board, tasks]
  );

  return (
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
                className="grow"
                title={'Unassigned tasks'}
                tasks={unassignedTasks}
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
  );
};
