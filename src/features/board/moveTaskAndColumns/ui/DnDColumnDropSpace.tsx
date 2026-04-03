import type { PropsWithClassName } from '@/shared/types/types';
import clsx from 'clsx';
import { useMemo, type FC } from 'react';
import { TYPE_COLUMN_DROP_SPACE, TYPE_COLUMN } from '../config/dndConstants';
import { useDroppable } from '@dnd-kit/react';
import { InsertionType } from '@/shared/api/board/boardApi';

export type DnDColumnDropSpaceProps = {
  id: string;
  columnIndex: number;
  columnId: string;
  nextColumnId?: string;
  prevColumnId?: string;
  refIndex: number;
  refId: string;
  insertionType: InsertionType.before | InsertionType.append;
} & PropsWithClassName;

export const DnDColumnDropSpace: FC<DnDColumnDropSpaceProps> = ({
  className,
  nextColumnId,
  prevColumnId,
  columnIndex,
  refIndex,
  refId,
  columnId,
  insertionType,
  id,
}) => {
  const { ref, isDropTarget } = useDroppable({
    id,
    type: TYPE_COLUMN_DROP_SPACE,
    accept: (source) => {
      if (source.type === TYPE_COLUMN) {
        if (insertionType === InsertionType.before) {
          if (source.id !== nextColumnId && source.id !== prevColumnId) return true;
        }

        if (insertionType === InsertionType.append) {
          if (source.id !== prevColumnId) return true;
        }
      }

      return false;
    },
    data: {
      refId,
      refIndex,
      columnIndex,
      columnId,
      insertionType,
      subject: TYPE_COLUMN,
    },
  });

  const classes = useMemo(
    () =>
      clsx(
        'transform transition-width duration-300 ease-in-out w-4 rounded-md',
        isDropTarget && 'bg-gray-200 w-10 border-gray-100 not',
        className
      ),
    [className, isDropTarget]
  );

  return <div className={classes} ref={ref}></div>;
};
