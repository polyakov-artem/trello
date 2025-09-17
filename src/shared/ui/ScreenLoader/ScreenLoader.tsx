import { Spin } from 'antd';
import type { FC } from 'react';

export const ScreenLoader: FC = () => {
  return (
    <div className="flex justify-center items-center grow flex-col gap-4">
      <Spin size="large" />
      <p className="text-2xl text-blue-500">Loading...</p>
    </div>
  );
};
