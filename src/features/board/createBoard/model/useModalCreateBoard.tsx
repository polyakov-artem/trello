import { useCallback, useMemo, useState } from 'react';
import { useCreateBoard } from './useCreateBoard';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useCreateBoardContext } from './CreateBoardContext';

export const defaultFormState = {
  title: '',
};

const schema = Yup.object().shape({
  title: Yup.string()
    .min(2, 'Title must be at least 2 characters long')
    .max(50, 'Title must be no longer than 50 characters')
    .required('Title is required'),
});

export const useModalCreateBoard = () => {
  const { closeModal, isOpen } = useCreateBoardContext();
  const [formError, setFormError] = useState('');
  const { createBoard, isCreatingBoard, canCreateBoard } = useCreateBoard();

  const formik = useFormik({
    initialValues: defaultFormState,
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        setFormError('');
        await createBoard(values);
        handleCloseModal();
      } catch (e) {
        if (e instanceof Error) {
          setFormError(e.message);
        }
      }
    },
  });

  const { resetForm, touched, errors, values, handleSubmit } = formik;

  const handleCloseModal = useCallback(() => {
    setFormError('');
    closeModal();
    resetForm();
  }, [closeModal, resetForm]);

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

  const handleSubmitBtnClick = useCallback(() => handleSubmit(), [handleSubmit]);

  return useMemo(
    () => ({
      values,
      titleError: touched.title && errors.title ? errors.title : '',
      formError,
      handleInputChange,
      handleSubmit,
      handleSubmitBtnClick,
      closeModal: handleCloseModal,
      isFormDisabled: !canCreateBoard,
      isCreatingBoard,
      isOpen,
    }),
    [
      canCreateBoard,
      errors.title,
      formError,
      handleCloseModal,
      handleInputChange,
      handleSubmit,
      handleSubmitBtnClick,
      isCreatingBoard,
      isOpen,
      touched.title,
      values,
    ]
  );
};
