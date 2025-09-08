import { getPathWithPublicRoute } from '../lib/getPathWithPublicRoute';

export const ROUTER_PATHS = {
  HOME: getPathWithPublicRoute(),
  BOARDS: getPathWithPublicRoute('boards'),
  USERS: getPathWithPublicRoute('users'),
} as const;
