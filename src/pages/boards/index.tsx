import { type FC } from 'react';
import {
  BtnCreateBoard,
  CreateBoardProvider,
  ModalCreateBoard,
} from '@/features/board/createBoard';
import { BoardsTable } from '@/widgets/BoardsTable';
import { AuthProtected } from '@/widgets/AuthProtected';
import { useBoardsQuery } from '@/entities/board/';
import { EditBoardProvider, ModalEditBoard } from '@/features/board/editBoard';

const TITLE = 'Boards';

export const BoardsPage: FC = () => {
  const { boards, isFetchingBoards, boardsError } = useBoardsQuery();

  return (
    <div className="container mx-auto p-4 grow flex">
      <div className="flex flex-col gap-6 grow">
        <h1 className="font-bold text-3xl text-center ">{TITLE}</h1>
        <AuthProtected className="grow">
          <CreateBoardProvider>
            <BtnCreateBoard className={'ml-auto'} />
            <EditBoardProvider>
              <BoardsTable
                boards={boards}
                isLoading={isFetchingBoards}
                errorMsg={boardsError?.message}
              />
              <ModalEditBoard />
            </EditBoardProvider>
            <ModalCreateBoard />
          </CreateBoardProvider>
        </AuthProtected>
      </div>
    </div>
  );
};
