import { Button } from 'antd';
import { useCallback, useState, type FC, type PropsWithChildren, type ReactNode } from 'react';
import type { PropsWithClassName } from '@/shared/types/types';
import { createPortal } from 'react-dom';
import { nanoid } from 'nanoid';
import { DelayerContext } from './DelayerContext';

function createResolver() {
  let resolve!: () => void;
  let reject!: (e: Error) => void;

  const promise = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

export const DelayerProvider: FC<PropsWithChildren & PropsWithClassName> = ({ children }) => {
  const [portalContent, setPortalContent] = useState<Array<{ key: string; content: ReactNode }>>(
    []
  );

  const createDelayer = useCallback((resolveBtnTitle = 'Resolve', rejectBtnTitle = 'Reject') => {
    const resolver = createResolver();
    const key = nanoid();

    const handleClick: React.MouseEventHandler<HTMLButtonElement> = ({
      currentTarget: { value },
    }) => {
      if (value === rejectBtnTitle) {
        resolver.reject(new Error(value));
      } else if (value === resolveBtnTitle) {
        resolver.resolve();
      }

      console.log(value);

      setPortalContent((prev) => prev.filter(({ key: k }) => k !== key));
    };

    setPortalContent((prev) => {
      return [
        {
          key,
          content: (
            <div key={key} className="flex gap-2 items-center">
              <span>{prev.length}</span>
              <Button value={resolveBtnTitle} onClick={handleClick}>
                {resolveBtnTitle}
              </Button>
              <Button value={rejectBtnTitle} onClick={handleClick}>
                {rejectBtnTitle}
              </Button>
            </div>
          ),
        },
        ...prev,
      ];
    });

    return resolver;
  }, []);

  return (
    <DelayerContext value={createDelayer}>
      {children}
      {portalContent.length &&
        createPortal(
          <div className="fixed right-0 top-0 z-50 flex flex-col gap-2 bg-white/50 p-2 border-gray-200 w-[200px]">
            {portalContent.map(({ content }) => content)}
          </div>,
          document.body
        )}
    </DelayerContext>
  );
};
