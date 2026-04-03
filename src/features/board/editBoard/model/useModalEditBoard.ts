import { useCallback, useEffect, useState } from 'react';
import { useBoardQuery } from '@/entities/board';

import { type CheckboxChangeEvent } from 'antd';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useEditBoardContext } from './EditBoardContext';
import { useEditBoard } from './useEditBoard';

export const defaultFormState = {
  title: '',
};

const schema = Yup.object().shape({
  title: Yup.string()
    .min(2, 'Title must be at least 2 characters long')
    .max(50, 'Title must be no longer than 50 characters')
    .required('Title is required'),
});

export const useModalEditBoard = () => {
  const { closeModal, details, isOpen, onCloseComplete } = useEditBoardContext();
  const boardId = details?.boardId || '';
  const { board, boardError, isFetchingBoard } = useBoardQuery(boardId);
  const [formError, setFormError] = useState('');
  const { editBoard, isEditingBoard, canEditBoard } = useEditBoard(boardId);

  const formik = useFormik({
    initialValues: defaultFormState,
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        setFormError('');
        await editBoard(values);
        handleCloseModal();
      } catch (e) {
        if (e instanceof Error) {
          setFormError(e.message);
        }
      }
    },
  });

  const { setValues, resetForm, values, handleSubmit, touched, errors } = formik;

  const handleCloseModal = useCallback(() => {
    setFormError('');
    resetForm();
    closeModal();
  }, [closeModal, resetForm]);

  useEffect(() => {
    if (isOpen && board) {
      void setValues({
        title: board.title,
      });
    }
  }, [board, isOpen, setValues]);

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

  const handleSubmitBtnClick = useCallback(() => handleSubmit(), [handleSubmit]);

  const isFormDisabled = !canEditBoard;

  return {
    isEditingBoard,
    isFetchingBoard,
    boardError,
    closeModal: handleCloseModal,
    isOpen,
    isFormDisabled,
    onCloseComplete,
    formError,
    titleError: errors.title && touched.title ? errors.title : '',
    values,
    handleInputChange,
    handleCheckboxChange,
    handleSubmit,
    handleSubmitBtnClick,
  };
};
