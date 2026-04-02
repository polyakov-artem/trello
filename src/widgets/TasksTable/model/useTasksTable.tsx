import { useMemo } from 'react';
import { type GetProp, type TableProps } from 'antd';
import type { Task } from '@/shared/types/types';
import { BtnDeleteTask } from '@/features/task/deleteTask';
import { BtnEditTask } from '@/features/task/EditTask';
import { useTaskLocationMapContext } from '../../../entities/task/model/TaskLocationMapContext';
import { useBoardsMapContext } from '@/entities/board';
import { ROUTER_PATHS } from '@/shared/config/routes';
import { Link } from 'react-router';

export type ColumnsType<T extends object> = GetProp<TableProps<T>, 'columns'>;

export type DataType = {
  key: string;
  index: number;
  title: string;
  description: string;
  completed: boolean;
  board: {
    boardId: string;
    boardTitle: string;
  };
  actions: {
    taskId: string;
    boardId: string;
  };
};

export const BTN_DELETE_TEXT = 'Delete';
export const BTN_EDIT_TEXT = 'Edit';

export const useTasksTable = (tasks?: Task[]) => {
  const taskLocationMap = useTaskLocationMapContext();
  const boardsMap = useBoardsMapContext();

  const dataSource = useMemo(() => {
    return (tasks || []).map(({ id: taskId, title, description, completed }, index) => {
      const boardId = taskLocationMap[taskId]?.boardId || '';
      const boardTitle = boardsMap[boardId]?.title || '';

      return {
        key: taskId,
        index: index + 1,
        title,
        description,
        completed,
        board: {
          boardId,
          boardTitle,
        },
        actions: {
          taskId,
          boardId,
        },
      };
    });
  }, [boardsMap, taskLocationMap, tasks]);

  const columns: ColumnsType<DataType> = useMemo(() => {
    return [
      {
        title: '№',
        dataIndex: 'index',
        sorter: (a, b) => a.index - b.index,
      },
      {
        title: 'Title',
        dataIndex: 'title',
        sorter: (a, b) => a.title.localeCompare(b.title, 'en'),
        filterSearch: true,
        onFilter: (value, record) => record.title.indexOf(value as string) === 0,
      },

      {
        title: 'Description',
        dataIndex: 'description',
      },
      {
        title: 'Completed',
        dataIndex: 'completed',
        render: (completed) => (completed ? 'Yes' : 'No'),
      },
      {
        title: 'Board',
        dataIndex: 'board',
        render: ({ boardId, boardTitle }: { boardId: string; boardTitle: string }) => {
          return <Link to={ROUTER_PATHS.BOARD.replace(':boardId', boardId)}>{boardTitle}</Link>;
        },
      },
      {
        title: '',
        dataIndex: 'actions',
        render: ({ taskId, boardId }: { taskId: string; boardId: string }) => (
          <div className="inline-flex flex-wrap gap-2 items-center">
            <BtnDeleteTask taskId={taskId} boardId={boardId}>
              {BTN_DELETE_TEXT}
            </BtnDeleteTask>
            <BtnEditTask taskId={taskId}>{BTN_EDIT_TEXT}</BtnEditTask>
          </div>
        ),
        width: '200px',
      },
    ];
  }, []);

  return useMemo(
    () => ({
      columns,
      dataSource,
    }),
    [columns, dataSource]
  );
};
