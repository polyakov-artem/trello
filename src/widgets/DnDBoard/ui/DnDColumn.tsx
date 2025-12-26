import type { Task } from '@/shared/types/types';
import type { PropsWithClassName } from '@/shared/types/types';
import clsx from 'clsx';
import { useMemo, type FC, type ReactNode } from 'react';
import { DnDTask } from './DnDTask';

export type DnDColumnProps = {
  title: string;
  tasks: Task[];
  actions?: ReactNode;
} & PropsWithClassName;

export const DnDColumn: FC<DnDColumnProps> = ({ className, title, tasks, actions }) => {
  const classes = useMemo(
    () => clsx('flex flex-col grow gap-4 bg-white rounded-md', className),
    [className]
  );

  const columnTasks = useMemo(
    () => tasks.map((task) => <DnDTask key={task.id} task={task} />),
    [tasks]
  );

  return (
    <div className={classes}>
      <div className="flex justify-between flex-wrap items-center gap-2 border-b-1 p-2 border-b-slate-300">
        <h4 className="font-bold ">{title}</h4>
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      </div>
      <ul className="flex flex-col gap-2 p-2">{columnTasks}</ul>
    </div>
  );
};
