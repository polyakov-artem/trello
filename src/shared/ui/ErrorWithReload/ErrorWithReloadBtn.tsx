import { errorAdvices } from '@/shared/constants/errorMsgs';
import { reloadPage } from '@/shared/lib/reloadPage';
import type { PropsWithClassName } from '@/shared/types/types';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import clsx from 'clsx';
import type { FC } from 'react';

export type ErrorWithReloadBtnProps = {
  title?: string;
  subtitle?: string;
  inline?: boolean;
} & PropsWithClassName;

export const ErrorWithReloadBtn: FC<ErrorWithReloadBtnProps> = ({
  title = '',
  className,
  inline,
}) => {
  const classes = clsx(className, 'flex justify-center items-center grow gap-2', {
    'flex-col': !inline,
  });

  return (
    <div className={classes}>
      <CloseCircleOutlined className="text-4xl" style={{ color: 'red' }} />
      <h4 className="text-3xl">{title}</h4>
      <p className="mb-4">{errorAdvices.tryAgain}</p>
      <Button type="primary" onClick={reloadPage}>
        Reload page
      </Button>
    </div>
  );
};
