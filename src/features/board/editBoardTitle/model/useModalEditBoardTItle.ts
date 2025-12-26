import { useCallback, useEffect, useMemo, useState } from 'react';
import { useBoard, useBoardError, useBoardIsLoading, useBoardUpdateStore } from '@/entities/board';

import { type CheckboxChangeEvent } from 'antd';
import * as Yup from 'yup';
import { useFormik } from 'formik';

import { useCanUpdateBoardTitle } from './guards';
import { useEditBoardTitleContext } from './EditBoardTitleContext';
import { useUpdateBoardTitle } from './useUpdateBoardTitle';

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
  const { closeModal, details, isOpen, onCloseComplete } = useEditBoardTitleContext();
  const boardId = details?.boardId ?? '';

  const [formError, setFormError] = useState('');
  const updateBoardTitle = useUpdateBoardTitle();

  const isUpdatingBoard = useBoardUpdateStore.use.isLoading();

  const board = useBoard(boardId);
  const isLoadingBoard = useBoardIsLoading();
  const boardError = useBoardError(boardId);

  const canUpdateBoardTitle = useCanUpdateBoardTitle();

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

      const result = await updateBoardTitle({
        boardId: board.id,
        boardDraft: values,
        onStart: () => setFormError(''),
      });

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

  const isFormDisabled = !canUpdateBoardTitle || isLoadingBoard;

  return useMemo(
    () => ({
      isProcessing: isUpdatingBoard,
      isLoading: isLoadingBoard,
      error: boardError,
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
      boardError,
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
      isLoadingBoard,
      isOpen,
      isUpdatingBoard,
      onCloseComplete,
    ]
  );
};
