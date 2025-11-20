export const getPathWithPublicRoute = (path: string = '') => {
  const PUBLIC_PATH = import.meta.env.VITE_PUBLIC_PATH || '/';
  return PUBLIC_PATH + path;
};
