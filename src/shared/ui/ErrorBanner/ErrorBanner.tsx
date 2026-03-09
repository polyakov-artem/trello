import { errorAdvices } from '@/shared/config/errorMsgs';
import type { PropsWithClassName } from '@/shared/types/types';
import { CloseCircleOutlined } from '@ant-design/icons';
import clsx from 'clsx';
import type { FC } from 'react';

export type ErrorBannerProps = {
  title?: string;
  subtitle?: string;
  inline?: boolean;
  withDefaultIcon?: boolean;
  icon?: React.ReactNode;
  withDefaultSubtitle?: boolean;
  actions?: React.ReactNode;
} & PropsWithClassName;

export const ErrorBanner: FC<ErrorBannerProps> = ({
  title = '',
  className,
  inline,
  withDefaultIcon,
  icon,
  subtitle,
  withDefaultSubtitle,
  actions,
}) => {
  const classes = clsx(
    'flex justify-center items-center grow gap-2 p-4',
    [!inline && 'flex-col'],
    className
  );

  return (
    <div className={classes}>
      {(withDefaultIcon || icon) &&
        (icon ? icon : <CloseCircleOutlined className="text-4xl" style={{ color: 'red' }} />)}

      <h4 className="text-2xl">{title}</h4>
      {(withDefaultSubtitle || subtitle) && <p>{subtitle || errorAdvices.tryAgain}</p>}
      {!!actions && actions}
    </div>
  );
};
