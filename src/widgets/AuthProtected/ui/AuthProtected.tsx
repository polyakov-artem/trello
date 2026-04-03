import { useMemo, type FC, type PropsWithChildren } from 'react';
import { Spinner } from '@/shared/ui/Spinner/Spinner';
import type { PropsWithClassName } from '@/shared/types/types';
import clsx from 'clsx';
import { useIsLoadingSession, useSessionId } from '@/entities/session';

const MSG_NO_PERMISSION = "Please log in. You don't have permission view this section";

export const AuthProtected: FC<PropsWithChildren & PropsWithClassName> = ({
  children,
  className,
}) => {
  const isLoadingSession = useIsLoadingSession();
  const sessionId = useSessionId();

  const msgClasses = useMemo(() => clsx('font-bold text-center', className), [className]);

  if (isLoadingSession) {
    return <Spinner withMsg className={className} />;
  }

  if (!sessionId) {
    return <p className={msgClasses}>{MSG_NO_PERMISSION}</p>;
  }

  return <>{children}</>;
};
