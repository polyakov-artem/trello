import type { FC } from 'react';
import { AppRouter } from './AppRouter';
import { AppLoader } from './appLoader';
import { AppProviders } from './providers/AppProviders';
import { NotificationsWrap } from '@/shared/ui/NotificationsWrap/NotificationsWrap';
import { Confirmation } from '@/shared/ui/Confirmation/Confirmation';

const App: FC = () => {
  return (
    <AppProviders>
      <AppLoader />
      <AppRouter />
      <NotificationsWrap />
      <Confirmation />
    </AppProviders>
  );
};

export default App;
