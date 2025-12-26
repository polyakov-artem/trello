import { errorAdvices } from '@/shared/constants/errorMsgs';
import { reloadPage } from '@/shared/lib/locationUtils';
import type { PropsWithClassName } from '@/shared/types/types';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import clsx from 'clsx';
import type { FC } from 'react';

export type ErrorBannerProps = {
  title?: string;
  subtitle?: string;
  inline?: boolean;
  withIcon?: boolean;
  icon?: React.ReactNode;
  withSubtitle?: boolean;
  withReloadBtn?: boolean;
  actions?: React.ReactNode;
} & PropsWithClassName;

export const ErrorBanner: FC<ErrorBannerProps> = ({
  title = '',
  className,
  inline,
  withIcon,
  icon,
  withReloadBtn,
  subtitle,
  withSubtitle,
  actions,
}) => {
  const classes = clsx(
    'flex justify-center items-center grow gap-2 p-4',
    [!inline && 'flex-col'],
    className
  );

  return (
    <div className={classes}>
      {withIcon &&
        (icon ? icon : <CloseCircleOutlined className="text-4xl" style={{ color: 'red' }} />)}

      <h4 className="text-2xl">{title}</h4>

      {withSubtitle && <p>{subtitle || errorAdvices.tryAgain}</p>}

      {withReloadBtn && (
        <Button type="primary" onClick={reloadPage}>
          Reload page
        </Button>
      )}

      {!!actions && actions}
    </div>
  );
};
