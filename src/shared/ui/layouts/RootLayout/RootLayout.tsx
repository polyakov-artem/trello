import type { FC, ReactNode } from 'react';
import { Outlet } from 'react-router';

export type RootLayoutProps = {
  header: ReactNode;
};

const RootLayout: FC<RootLayoutProps> = ({ header }) => {
  return (
    <div className="min-h-dvh flex flex-col">
      {header}
      <main className="grow">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
