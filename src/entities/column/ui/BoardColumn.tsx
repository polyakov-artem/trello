import type { PropsWithClassName } from '@/shared/types/types';
import clsx from 'clsx';
import { useMemo, type FC, type ReactNode } from 'react';

export type BoardColumnProps = {
  title: string;
  columnRef: (element: Element | null) => void;
  listRef: (element: Element | null) => void;
  listItems: ReactNode[];
  topActions?: ReactNode;
  bottomActions?: ReactNode;
  listClassName?: string;
  style?: React.CSSProperties;
} & PropsWithClassName;

export const BoardColumn: FC<BoardColumnProps> = ({
  className,
  columnRef,
  listRef,
  title,
  listItems,
  topActions,
  bottomActions,
  listClassName,
  style,
}) => {
  const columnClasses = useMemo(
    () => clsx('flex flex-col grow bg-white rounded-md', className),
    [className]
  );

  const listClasses = useMemo(
    () => clsx('m-2 pt-0 grow flex flex-col rounded-md min-h-40', [listClassName]),
    [listClassName]
  );

  return (
    <div className={columnClasses} ref={columnRef} style={style}>
      <div className="flex flex-col gap-2 border-b-1 p-2 border-b-slate-300">
        <div className="flex justify-between flex-wrap items-center gap-2">
          <h4 className="font-bold mb-2">{title}</h4>
          <div className="flex items-center gap-2">{topActions}</div>
        </div>
        <div className="flex justify-between items-center gap-2">{bottomActions}</div>
      </div>
      <ul className={listClasses} ref={listRef}>
        {listItems}
      </ul>
    </div>
  );
};
