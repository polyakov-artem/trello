import { useParams } from 'react-router';
import { errorBoardNotFound, useBoardQuery } from './useBoardQuery';
import { FetchError } from '@/shared/lib/safeFetch';

export const useBoard = () => {
  const { boardId = '' } = useParams();
  const { board } = useBoardQuery(boardId);

  if (!board) {
    throw new FetchError(errorBoardNotFound);
  }

  return board;
};
