import type { Task } from '@/shared/types/types';
import type { PropsWithClassName } from '@/shared/types/types';
import clsx from 'clsx';
import { useMemo, type FC, type ReactNode } from 'react';
import { BtnDeleteTask } from '@/features/task/deleteTask';
import { BtnEditTask } from '@/features/task/EditTask';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { TaskSelector } from '@/features/task/selectTask';
import { CollisionPriority } from '@dnd-kit/abstract';
import { useSortable } from '@dnd-kit/react/sortable';
import { useDroppable } from '@dnd-kit/react';
import { BoardColumn } from '@/entities/column';
import {
  getTaskDropSpaceId,
  getListId,
  InsertionType,
  TYPE_COLUMN,
  TYPE_TASK_LIST,
  TYPE_TASK,
} from '../config/dndConstants';
import { DnDTaskDropSpace } from './DnDTaskDropSpace';
import { DnDTask } from './DnDTask';

const colorGray = 'oklch(98.5% 0.002 247.839)';

const columnDragStyles = {
  border: `1px solid ${colorGray}`,
  backgroundColor: 'white',
  opacity: 0.8,
};

const columnDropStyles = {
  backgroundColor: colorGray,
};

export type DnDColumnProps = {
  title: string;
  tasksIds: string[];
  tasksMap: Record<string, Task>;
  columnId: string;
  columnIndex: number;
  topActions?: ReactNode;
  bottomActions?: ReactNode;
  isSortable?: boolean;
} & PropsWithClassName;

export const DnDColumn: FC<DnDColumnProps> = ({
  className,
  title,
  tasksIds,
  tasksMap,
  topActions,
  bottomActions,
  columnId,
  columnIndex,
  isSortable = true,
}) => {
  const items = useMemo(() => {
    return tasksIds.reduce((acc, taskId, index) => {
      const dropSpaceBeforeId = getTaskDropSpaceId(InsertionType.before, taskId);
      const dropSpaceAppendId = getTaskDropSpaceId(InsertionType.append, taskId);

      acc.push(
        <DnDTaskDropSpace
          key={dropSpaceBeforeId}
          id={dropSpaceBeforeId}
          columnIndex={columnIndex}
          columnId={columnId}
          prevTaskId={tasksIds[index - 1]}
          nextTaskId={taskId}
          taskIndex={index}
          taskId={taskId}
          insertionType={InsertionType.before}
        />,
        <DnDTask
          key={taskId}
          className="w-full flex-none max-w-full"
          columnIndex={columnIndex}
          columnId={columnId}
          task={tasksMap[taskId]}
          index={index}
          actionsBefore={<TaskSelector columnId={columnId} taskId={taskId} className="flex-none" />}
          actionsAfter={
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
      );

      if (index === tasksIds.length - 1) {
        acc.push(
          <DnDTaskDropSpace
            key={dropSpaceAppendId}
            id={dropSpaceAppendId}
            columnIndex={columnIndex}
            columnId={columnId}
            prevTaskId={taskId}
            taskIndex={index}
            taskId={taskId}
            insertionType={InsertionType.append}
          />
        );
      }

      return acc;
    }, [] as ReactNode[]);
  }, [columnId, tasksIds, tasksMap, columnIndex]);

  const {
    ref: columnRef,
    isDropTarget: columnIsDropTarget,
    isDragging: isDraggingColumn,
  } = useSortable({
    disabled: !isSortable,
    index: columnIndex,
    id: columnId,
    type: TYPE_COLUMN,
    accept: (source) => {
      if (source.type === TYPE_COLUMN && source.id !== columnId) {
        return true;
      }

      return false;
    },
    collisionPriority: CollisionPriority.Lowest,
    data: {
      subject: TYPE_COLUMN,
      columnIndex,
      columnId,
      insertionType: InsertionType.swap,
    },
  });

  const { isDropTarget: listIsDropTarget, ref: listRef } = useDroppable({
    id: getListId(columnId),
    type: TYPE_TASK_LIST,
    accept: (source) => {
      if (source.type === TYPE_TASK && source.data.columnId !== columnId) {
        return true;
      }
      return false;
    },
    collisionPriority: CollisionPriority.Low,
    data: {
      subject: TYPE_TASK,
      columnId,
      columnIndex,
      insertionType: InsertionType.append,
    },
  });

  const columnStyles = useMemo(() => {
    return columnIsDropTarget ? columnDropStyles : isDraggingColumn ? columnDragStyles : undefined;
  }, [columnIsDropTarget, isDraggingColumn]);

  const listClasses = useMemo(() => clsx(listIsDropTarget && 'bg-gray-100'), [listIsDropTarget]);

  return (
    <BoardColumn
      style={columnStyles}
      title={title}
      columnRef={columnRef}
      listRef={listRef}
      listItems={items}
      listClassName={listClasses}
      className={className}
      topActions={topActions}
      bottomActions={bottomActions}
    />
  );
};
