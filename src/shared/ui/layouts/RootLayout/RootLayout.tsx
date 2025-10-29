import type { FC, ReactNode } from 'react';
import { Outlet } from 'react-router';

export type RootLayoutProps = {
  header: ReactNode;
};

export const RootLayout: FC<RootLayoutProps> = ({ header }) => {
  return (
    <div className="min-h-dvh flex flex-col">
      {header}
      <main className="grow flex flex-col">
        <Outlet />
      </main>
    </div>
  );
};
