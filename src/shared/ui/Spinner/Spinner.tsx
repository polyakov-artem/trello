import type { PropsWithClassName } from '@/shared/types/types';
import { Spin } from 'antd';
import clsx from 'clsx';
import { useMemo, type FC } from 'react';

export type SpinnerProps = {
  message?: string;
  withMsg?: boolean;
  withOverlay?: boolean;
  overlayClassName?: string;
  onTopMode?: boolean;
  whiteOverlay?: boolean;
} & PropsWithClassName;

export const MSG_LOADING = 'Loading, please wait...';

export const Spinner: FC<SpinnerProps> = ({
  className,
  message,
  withMsg,
  withOverlay,
  whiteOverlay,
  overlayClassName,
  onTopMode,
}) => {
  const classes = useMemo(
    () =>
      clsx(
        'flex justify-center items-center grow flex-col gap-4 ',
        onTopMode && 'absolute z-10 inset-0',
        className
      ),
    [onTopMode, className]
  );

  const bgClasses = useMemo(
    () => clsx('absolute inset-0', [whiteOverlay && 'bg-white/50'], overlayClassName),
    [overlayClassName, whiteOverlay]
  );

  return (
    <div className={classes}>
      {withOverlay && <div className={bgClasses} />}
      <Spin size="large" />
      {withMsg && <p className="text-2xl text-blue-500">{message || MSG_LOADING}</p>}
    </div>
  );
};
