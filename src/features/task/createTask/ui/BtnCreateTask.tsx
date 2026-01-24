import type { PropsWithClassName } from '@/shared/types/types';
import { Button } from 'antd';
import { type FC, type PropsWithChildren } from 'react';
import { useCreateTaskContext } from '../model/CreateTaskContext';
import type { BaseButtonProps } from 'antd/es/button/button';

export type BtnCreateTaskProps = {
  size?: BaseButtonProps['size'];
} & PropsWithClassName &
  PropsWithChildren;

export const BtnCreateTask: FC<BtnCreateTaskProps> = ({ className, children, size }) => {
  const { openModal } = useCreateTaskContext();

  return (
    <Button
      size={size}
      onClick={openModal}
      color="green"
      variant="solid"
      className={className}
      iconPosition={'end'}>
      {children}
    </Button>
  );
};
