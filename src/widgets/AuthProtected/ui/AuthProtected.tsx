import { useMemo, type FC, type PropsWithChildren } from 'react';

import { Spinner } from '@/shared/ui/Spinner/Spinner';
import { ErrorBanner } from '@/shared/ui/ErrorBanner/ErrorBanner';
import type { PropsWithClassName } from '@/shared/types/types';
import clsx from 'clsx';
import { useSessionStore } from '@/entities/session';
import { Button } from 'antd';
import { reloadPage } from '@/shared/lib/locationUtils';
import { BtnLogout } from '@/features/auth/logout';
import { errorAdvices } from '@/shared/config/errorMsgs';

const MSG_NO_PERMISSION = "Please log in. You don't have permission view this section";

export const AuthProtected: FC<PropsWithChildren & PropsWithClassName> = ({
  children,
  className,
}) => {
  const sessionError = useSessionStore.use.error();
  const sessionIsLoading = useSessionStore.use.isLoading();
  const session = useSessionStore.use.value();

  const msgClasses = useMemo(() => clsx('font-bold text-center', className), [className]);

  if (sessionIsLoading) {
    return <Spinner withMsg className={className} />;
  }

  if (sessionError) {
    if (sessionError.status === 404) {
      return (
        <ErrorBanner
          title={sessionError.message}
          className={className}
          withDefaultIcon
          subtitle={errorAdvices.logout}
          actions={<BtnLogout forcibly>Log out</BtnLogout>}
        />
      );
    }

    return (
      <ErrorBanner
        title={sessionError.message}
        className={className}
        withDefaultIcon
        withDefaultSubtitle
        actions={
          <Button type="primary" onClick={reloadPage}>
            Reload page
          </Button>
        }
      />
    );
  }

  if (!session) {
    return <p className={msgClasses}>{MSG_NO_PERMISSION}</p>;
  }

  return <>{children}</>;
};
