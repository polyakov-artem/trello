import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCreateBoard } from './useCreateBoard';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useCanCreateBoard } from './guards';
import { useCreateBoardContext } from './CreateBoardContext';
import { useBoardCreationStore } from '@/entities/board';

export const defaultFormState = {
  title: '',
};

const schema = Yup.object().shape({
  title: Yup.string()
    .min(2, 'Title must be at least 2 characters long')
    .max(20, 'Title must be no longer than 20 characters')
    .required('Title is required'),
});

export const useModalCreateBoard = () => {
  const { closeModal, isOpen } = useCreateBoardContext();
  const [formError, setFormError] = useState('');
  const createBoard = useCreateBoard();
  const canCreateBoard = useCanCreateBoard();
  const isProcessing = useBoardCreationStore.use.isLoading();

  const handleCloseModal = useCallback(() => {
    setFormError('');
    closeModal();
  }, [closeModal]);

  const formik = useFormik({
    initialValues: defaultFormState,
    validationSchema: schema,
    onSubmit: async (values) => {
      const result = await createBoard({
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

  const { resetForm } = formik;

  useEffect(() => {
    if (!isOpen) {
      void resetForm();
    }
  }, [isOpen, resetForm]);

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

  const handleSubmitBtnClick = useCallback(() => formik.handleSubmit(), [formik]);

  return useMemo(
    () => ({
      values: formik.values,
      titleError: formik.touched.title && formik.errors.title ? formik.errors.title : '',
      formError,
      handleInputChange,
      handleSubmit: formik.handleSubmit,
      handleSubmitBtnClick,
      closeModal: handleCloseModal,
      isFormDisabled: !canCreateBoard || isProcessing,
      isProcessing,
      isOpen,
    }),
    [
      canCreateBoard,
      formError,
      formik.errors.title,
      formik.handleSubmit,
      formik.touched.title,
      formik.values,
      handleCloseModal,
      handleInputChange,
      handleSubmitBtnClick,
      isProcessing,
      isOpen,
    ]
  );
};
