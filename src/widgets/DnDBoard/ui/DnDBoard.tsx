import type { Board } from '@/shared/api/board/boardApi';
import type { Task } from '@/shared/api/task/taskApi';
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
import { BtnCreateTask, CreateTaskProvider, ModalCreateTask } from '@/features/task/createTask';
import {
  AddColumnTaskProvider,
  BtnAddColumnTask,
  ModalAddColumnTask,
} from '@/features/board/addColumnTask';

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
              <BtnDeleteBoardColumn board={board} columnId={column.id} size="small">
                <DeleteOutlined />
              </BtnDeleteBoardColumn>
              <BtnAddColumnTask column={column} board={board} size="small">
                <FileAddOutlined />
              </BtnAddColumnTask>
            </>
          }
        />
      )),
    [board, tasks]
  );

  return (
    <AddBoardColumnProvider>
      <AddColumnTaskProvider>
        <CreateTaskProvider>
          <EditTaskProvider>
            <div className={classes}>
              <BtnAddBoardColumn className="self-end" boardId={board.id} />
              <div className="grow grid grid-cols-[300px_1fr] gap-2 relative">
                <div className="bg-gray-100 rounded-md p-2 flex">
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
                </div>
                <div className="bg-gray-100 rounded-md p-2 grid grid-cols-4 gap-2 ">{columns}</div>
                {isUpdating && <Spinner onTopMode withOverlay whiteOverlay />}
              </div>
            </div>
            <ModalAddBoardColumn board={board} />
            <ModalEditTask />
            <ModalCreateTask />
            <ModalAddColumnTask />
          </EditTaskProvider>
        </CreateTaskProvider>
      </AddColumnTaskProvider>
    </AddBoardColumnProvider>
  );
};
