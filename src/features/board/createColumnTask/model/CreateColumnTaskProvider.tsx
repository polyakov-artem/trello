import { CreateColumnTaskContext, type Details } from './CreateColumnTaskContext';
import { useModalProps } from '@/shared/ui/Modal/useModalProps';

export const CreateColumnTaskProvider = ({ children }: { children: React.ReactNode }) => {
  const contextValue = useModalProps<Details>();

  return <CreateColumnTaskContext value={contextValue}>{children}</CreateColumnTaskContext>;
};
