import { reloadPage } from '@/shared/lib/reloadPage';
import type { PropsWithClassName } from '@/shared/types/types';
import { Button, Result } from 'antd';
import clsx from 'clsx';
import type { FC } from 'react';

export type ErrorWithReloadBtnProps = {
  title?: string;
  subtitle?: string;
  buttons?: React.ReactNode;
} & PropsWithClassName;

export const ErrorWithReloadBtn: FC<ErrorWithReloadBtnProps> = ({ title, subtitle, className }) => {
  return (
    <Result
      className={clsx(className, 'flex justify-center items-center grow flex-col ')}
      status="error"
      title={title}
      subTitle={subtitle}
      extra={
        <Button type="primary" onClick={reloadPage}>
          Reload page
        </Button>
      }
    />
  );
};
