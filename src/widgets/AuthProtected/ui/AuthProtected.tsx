import { useMemo, type FC, type PropsWithChildren } from 'react';

import { Spinner } from '@/shared/ui/Spinner/Spinner';
import { ErrorBanner } from '@/shared/ui/ErrorBanner/ErrorBanner';
import type { PropsWithClassName } from '@/shared/types/types';
import clsx from 'clsx';
import { useSessionStore } from '@/entities/session';

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
    return (
      <ErrorBanner
        title={sessionError.message}
        className={className}
        withIcon
        withReloadBtn
        withSubtitle
      />
    );
  }

  if (!session) {
    return <p className={msgClasses}>{MSG_NO_PERMISSION}</p>;
  }

  return <>{children}</>;
};
