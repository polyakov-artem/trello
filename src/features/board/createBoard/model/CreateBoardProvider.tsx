import { CreateBoardContext } from './CreateBoardContext';
import { useModalProps } from '@/shared/ui/Modal/useModalProps';

export const CreateBoardProvider = ({ children }: { children: React.ReactNode }) => {
  const contextValue = useModalProps();

  return <CreateBoardContext value={contextValue}>{children}</CreateBoardContext>;
};
