import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useBoardUpdateStore, useBoardsStore } from '@/entities/board';
import { useUpdateBoard } from './useUpdateBoard';
import { useSessionStore } from '@/entities/session';
import { errorNames, type FetchError } from '@/shared/lib/safeFetch';
import type { Board } from '@/shared/api/board/boardApi';

export type UseModalUpdateBoardProps = {
  closeModal: () => void;
  isOpen: boolean;
  boardId: string;
};

export const BOARD_NOT_FOUND = 'Board not found';

export const defaultFormState = {
  title: '',
};

export const useModalUpdateBoard = ({ closeModal, isOpen, boardId }: UseModalUpdateBoardProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [formValues, setFromValues] = useState(defaultFormState);
  const [formError, setFormError] = useState('');
  const updateBoard = useUpdateBoard();

  const checkIfUpdatingBoard = useBoardUpdateStore.use.checkIfLoading();
  const isUpdatingBoard = useBoardUpdateStore.use.isLoading();

  const session = useSessionStore.use.value();
  const isLoadingSession = useSessionStore.use.isLoading();
  const sessionError = useSessionStore.use.error();

  const boards = useBoardsStore.use.value();
  const isLoadingBoards = useBoardsStore.use.isLoading();
  const boardsError = useBoardsStore.use.error();

  const { board, boardError } = useMemo(() => {
    const board = boards.find((board) => board.id === boardId);
    const result: { board?: Board; boardError?: FetchError } = {
      board: undefined,
      boardError: undefined,
    };

    if (!isLoadingBoards) {
      if (!board) {
        result.boardError = {
          message: BOARD_NOT_FOUND,
          name: errorNames.unknown,
        } satisfies FetchError;
      } else {
        result.board = board;
      }
    }

    return result;
  }, [boards, isLoadingBoards, boardId]);

  useEffect(() => {
    if (board && isOpen) {
      setFromValues({
        title: board.title,
      });
    }
  }, [isOpen, board]);

  const isLoadingDeps = isLoadingSession || isLoadingBoards;
  const depsError = sessionError || boardsError || boardError;

  const isUpdateBtnDisabled = isUpdatingBoard;
  const isCancelBtnDisabled = isUpdatingBoard;

  const checkIfSubmitProhibited = useCallback(() => checkIfUpdatingBoard(), [checkIfUpdatingBoard]);

  const handleFieldChange = useCallback((name: string, value: string[] | string | boolean) => {
    setFormError('');
    setFromValues((prevState) => ({ ...prevState, [name]: value }));
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
      handleFieldChange(e.target.name, e.target.value);
    },
    [handleFieldChange]
  );

  const handleCloseModal = useCallback(() => {
    setFromValues(defaultFormState);
    setFormError('');
    closeModal();
  }, [closeModal]);

  const handleSubmit = useCallback(
    (e?: React.FormEvent<HTMLFormElement>) => {
      e?.preventDefault();

      if (checkIfSubmitProhibited()) return;

      setFormError('');

      void updateBoard(boardId, formValues).then((result) => {
        if (!result) {
          return;
        }

        if (result.ok === false) {
          setFormError(result.error.message);
        } else {
          handleCloseModal();
        }
      });
    },
    [checkIfSubmitProhibited, formValues, handleCloseModal, boardId, updateBoard]
  );

  const handleUpdateBtnClick = useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

  return useMemo(
    () => ({
      formRef,
      isUpdatingBoard,
      session,
      formValues,
      formError,
      isUpdateBtnDisabled,
      isCancelBtnDisabled,
      isLoadingDeps,
      depsError,
      handleInputChange,
      handleCloseModal,
      handleSubmit,
      handleUpdateBtnClick,
    }),
    [
      depsError,
      formError,
      formValues,
      handleCloseModal,
      handleInputChange,
      handleSubmit,
      handleUpdateBtnClick,
      isCancelBtnDisabled,
      isLoadingDeps,
      isUpdateBtnDisabled,
      isUpdatingBoard,
      session,
    ]
  );
};
