import { useCallback, useEffect, useMemo, useState } from 'react';
import { useBoardUpdateStore, useBoardsStore } from '@/entities/board';
import { useUpdateBoard } from './useUpdateBoard';
import { type CheckboxChangeEvent } from 'antd';
import * as Yup from 'yup';
import { useFormik } from 'formik';

import { useCanUpdateBoard } from './guards';
import { useEditBoardContext } from './EditBoardContext';

export type UseModalUpdateBoardProps = {
  closeModal: () => void;
  isOpen: boolean;
  boardId: string;
};

export const BOARD_NOT_FOUND = 'Board not found';

export const defaultFormState = {
  title: '',
};

const schema = Yup.object().shape({
  title: Yup.string()
    .min(2, 'Title must be at least 2 characters long')
    .max(20, 'Title must be no longer than 20 characters')
    .required('Title is required'),
});

export const useModalEditBoard = () => {
  const { closeModal, details, isOpen, onCloseComplete } = useEditBoardContext();
  const detailsBoardId = details?.boardId ?? '';

  const [formError, setFormError] = useState('');
  const updateBoard = useUpdateBoard();

  const isUpdatingBoard = useBoardUpdateStore.use.isLoading();

  const boards = useBoardsStore.use.value();
  const isLoadingBoards = useBoardsStore.use.isLoading();
  const boardsError = useBoardsStore.use.error();

  const { board, boardErrorMsg } = useMemo(() => {
    const foundBoard = boards?.find((board) => board.id === detailsBoardId);

    return {
      board: foundBoard,
      boardErrorMsg: foundBoard ? undefined : BOARD_NOT_FOUND,
    };
  }, [detailsBoardId, boards]);

  const foundBoardId = board?.id || '';
  const canUpdateBoard = useCanUpdateBoard(foundBoardId);

  const handleCloseModal = useCallback(() => {
    setFormError('');
    closeModal();
  }, [closeModal]);

  const formik = useFormik({
    initialValues: defaultFormState,
    validationSchema: schema,
    onSubmit: async (values) => {
      if (!board) {
        return;
      }

      const boardDraft = { ...board, ...values };
      const result = await updateBoard(foundBoardId, boardDraft, () => setFormError(''));

      if (result) {
        if (result?.ok === false) {
          setFormError(result.error.message);
        } else {
          handleCloseModal();
        }
      }
    },
  });

  const { setValues, resetForm } = formik;

  useEffect(() => {
    if (isOpen) {
      if (board) {
        void setValues({
          title: board.title,
        });
      }
    } else {
      void resetForm();
    }
  }, [isOpen, setValues, resetForm, board]);

  const handleFieldChange = useCallback(
    (name: string, value: string[] | string | boolean) => {
      setFormError('');
      void formik.setFieldValue(name, value);
    },
    [formik]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
      handleFieldChange(e.target.name, e.target.value);
    },
    [handleFieldChange]
  );

  const handleCheckboxChange = useCallback(
    (e: CheckboxChangeEvent) => {
      handleFieldChange(e.target.name || '', e.target.checked);
    },
    [handleFieldChange]
  );

  const handleSubmitBtnClick = useCallback(() => formik.handleSubmit(), [formik]);

  const isLoadingDeps = isLoadingBoards;
  const depsErrorMsg = boardsError?.message || boardErrorMsg;

  useEffect(() => {
    if (isOpen && depsErrorMsg) {
      setFormError(depsErrorMsg);
    }
  }, [depsErrorMsg, isOpen]);

  const isFormDisabled = isUpdatingBoard || !canUpdateBoard || isLoadingDeps;

  return useMemo(
    () => ({
      inProcess: isUpdatingBoard,
      isLoadingDeps,
      depsErrorMsg,
      closeModal: handleCloseModal,
      isOpen,
      isFormDisabled,
      onCloseComplete,
      formError,
      titleError: formik.errors.title && formik.touched.title ? formik.errors.title : '',
      values: formik.values,
      handleInputChange,
      handleCheckboxChange,
      handleSubmit: formik.handleSubmit,
      handleSubmitBtnClick,
    }),
    [
      depsErrorMsg,
      formError,
      formik.errors.title,
      formik.handleSubmit,
      formik.touched.title,
      formik.values,
      handleCheckboxChange,
      handleCloseModal,
      handleInputChange,
      handleSubmitBtnClick,
      isFormDisabled,
      isLoadingDeps,
      isOpen,
      isUpdatingBoard,
      onCloseComplete,
    ]
  );
};
