import type { InsertionType } from '@/shared/api/board/boardApi';
export const TYPE_TASK = 'task';
export const TYPE_TASK_LIST = 'taskList';
export const TYPE_TASK_DROP_SPACE = 'taskDropSpace';
export const TYPE_COLUMN = 'column';
export const TYPE_COLUMN_DROP_SPACE = 'columnDropSpace';

export const getListId = (columnId: string) => {
  return `${TYPE_TASK_LIST}-${columnId}`;
};

export const getTaskDropSpaceId = (prefix: InsertionType, refId: string) => {
  return `${TYPE_TASK_DROP_SPACE}-${prefix}-${refId}`;
};
