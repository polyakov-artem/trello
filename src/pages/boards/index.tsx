import { type FC } from 'react';
import { useBoardsArray, useBoardsError, useBoardsIsLoading } from '@/entities/board';
import {
  BtnCreateBoard,
  CreateBoardProvider,
  ModalCreateBoard,
} from '@/features/board/createBoard';
import { BoardsTable } from '@/widgets/BoardsTable';
import { AuthProtected } from '@/widgets/AuthProtected';
import { EditBoardTitleProvider, ModalEditBoardTitle } from '@/features/board/editBoardTitle';

const TITLE = 'Boards';

export const BoardsPage: FC = () => {
  const boards = useBoardsArray();
  const isLoadingBoards = useBoardsIsLoading();
  const boardsError = useBoardsError();

  return (
    <CreateBoardProvider>
      <EditBoardTitleProvider>
        <div className="container mx-auto p-4 grow flex">
          <div className="flex flex-col gap-6 grow">
            <h1 className="font-bold text-3xl text-center ">{TITLE}</h1>
            <AuthProtected className="grow">
              <BtnCreateBoard className={'ml-auto'} />

              <BoardsTable
                boards={boards}
                isLoading={isLoadingBoards}
                errorMsg={boardsError?.message}
              />
            </AuthProtected>
          </div>
        </div>

        <ModalEditBoardTitle />
        <ModalCreateBoard />
      </EditBoardTitleProvider>
    </CreateBoardProvider>
  );
};
