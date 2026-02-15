import type { Task } from '@/shared/types/types';
import type { PropsWithClassName } from '@/shared/types/types';
import clsx from 'clsx';
import { useMemo, type FC, type ReactNode } from 'react';
import { BtnDeleteMultipleTasks, BtnDeleteTask } from '@/features/task/deleteTask';
import { BtnEditTask } from '@/features/task/EditTask';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { DnDTask } from '@/entities/task';
import { AllTasksSelector, TaskSelector } from '@/features/task/selectTask';

export type DnDColumnProps = {
  title: string;
  tasksIds: string[];
  tasksMap: Record<string, Task>;
  actions?: ReactNode;
  columnId: string;
} & PropsWithClassName;

export const DnDColumn: FC<DnDColumnProps> = ({
  className,
  title,
  tasksIds,
  tasksMap,
  actions,
  columnId,
}) => {
  const classes = useMemo(
    () => clsx('flex flex-col grow gap-4 bg-white rounded-md', className),
    [className]
  );

  const columnTasks = useMemo(
    () =>
      tasksIds.map((taskId) => (
        <div key={taskId} className="flex items-center gap-2">
          <TaskSelector columnId={columnId} taskId={taskId} className="flex-none" />
          <DnDTask
            className="grow"
            task={tasksMap[taskId]}
            actions={
              <>
                <BtnDeleteTask taskId={taskId} size={'small'}>
                  <DeleteOutlined />
                </BtnDeleteTask>
                <BtnEditTask taskId={taskId} size={'small'}>
                  <EditOutlined />
                </BtnEditTask>
              </>
            }
          />
        </div>
      )),
    [columnId, tasksIds, tasksMap]
  );

  return (
    <div className={classes}>
      <div className="flex flex-col gap-2 border-b-1 p-2 border-b-slate-300">
        <div className="flex justify-between flex-wrap items-center gap-2">
          <h4 className="font-bold ">{title}</h4>
          <div className="flex flex-wrap items-center gap-2">{actions}</div>
        </div>
        <div className="flex justify-between flex-wrap items-center gap-2">
          <AllTasksSelector columnId={columnId} tasksIds={tasksIds}>
            Select all
          </AllTasksSelector>
          <BtnDeleteMultipleTasks columnId={columnId} tasksIds={tasksIds} size={'small'}>
            <DeleteOutlined /> Delete all
          </BtnDeleteMultipleTasks>
        </div>
      </div>
      <ul className="flex flex-col gap-2 p-2">{columnTasks}</ul>
    </div>
  );
};
