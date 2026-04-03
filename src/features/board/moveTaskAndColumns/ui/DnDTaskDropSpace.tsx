import type { PropsWithClassName } from '@/shared/types/types';
import clsx from 'clsx';
import { useMemo, type FC } from 'react';
import { TYPE_TASK_DROP_SPACE, TYPE_TASK } from '../config/dndConstants';
import { useDroppable } from '@dnd-kit/react';
import { InsertionType } from '@/shared/api/board/boardApi';

export type DnDTaskDropSpaceProps = {
  id: string;
  columnId: string;
  prevTaskId?: string;
  taskId: string;
  insertionType: InsertionType.before | InsertionType.append;
} & PropsWithClassName;

export const DnDTaskDropSpace: FC<DnDTaskDropSpaceProps> = ({
  className,
  prevTaskId,
  taskId,
  columnId,
  insertionType,
  id,
}) => {
  const { ref, isDropTarget } = useDroppable({
    id,
    type: TYPE_TASK_DROP_SPACE,
    accept: (source) => {
      if (source.type === TYPE_TASK) {
        if (insertionType === InsertionType.before) {
          if (source.id !== taskId && source.id !== prevTaskId) return true;
        }

        if (insertionType === InsertionType.append) {
          if (source.id !== taskId) return true;
        }
      }

      return false;
    },
    data: {
      subject: TYPE_TASK,
      taskId,
      columnId,
      insertionType,
    },
  });

  const classes = useMemo(
    () =>
      clsx(
        'transform transition-height duration-300 ease-in-out h-4 rounded-md',
        isDropTarget && 'bg-gray-100 h-10 mt-2 mb-2',
        className
      ),
    [className, isDropTarget]
  );

  return <div className={classes} ref={ref}></div>;
};
