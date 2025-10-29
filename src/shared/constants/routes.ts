import { getPathWithPublicRoute } from '../lib/getPathWithPublicRoute';

export const ROUTER_PATHS = {
  HOME: getPathWithPublicRoute(),
  BOARDS: getPathWithPublicRoute('boards'),
  TASKS: getPathWithPublicRoute('tasks'),
  USERS: getPathWithPublicRoute('users'),
};
