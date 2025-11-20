import { getPathWithPublicRoute } from '@/shared/lib/envUtils';

export const ROUTER_PATHS = {
  HOME: getPathWithPublicRoute(),
  BOARDS: getPathWithPublicRoute('boards'),
  BOARD: getPathWithPublicRoute('boards/:boardId'),
  TASKS: getPathWithPublicRoute('tasks'),
  USERS: getPathWithPublicRoute('users'),
};
