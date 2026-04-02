import { useCallback, useMemo, useState } from 'react';
import { useBoard } from '@/entities/board';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useAddBoardColumnContext } from './AddBoardColumnContext';
import { useAddBoardColumn } from './useAddBoardColumn';

export const defaultFormState = {
  title: '',
};

const schema = Yup.object().shape({
  title: Yup.string()
    .min(2, 'Title must be at least 2 characters long')
    .max(50, 'Title must be no longer than 50 characters')
    .required('Title is required'),
});

export const useModalAddBoardColumn = () => {
  const boardId = useBoard().id;
  const { closeModal, isOpen, onCloseComplete } = useAddBoardColumnContext();
  const [formError, setFormError] = useState('');
  const { addBoardColumn, isAddingBoardColumn, canAddBoardColumn } = useAddBoardColumn(boardId);

  const formik = useFormik({
    initialValues: defaultFormState,
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        setFormError('');
        await addBoardColumn(values);
        handleCloseModal();
      } catch (e) {
        if (e instanceof Error) {
          setFormError(e.message);
        }
      }
    },
  });

  const { resetForm, values, handleSubmit, touched, errors } = formik;

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
  const isFormDisabled = !canAddBoardColumn;

  return useMemo(
    () => ({
      isAddingBoardColumn,
      closeModal: handleCloseModal,
      isOpen,
      isFormDisabled,
      onCloseComplete,
      formError,
      titleError: errors.title && touched.title ? errors.title : '',
      values,
      handleInputChange,
      handleSubmit,
      handleSubmitBtnClick,
    }),
    [
      errors.title,
      formError,
      handleCloseModal,
      handleInputChange,
      handleSubmit,
      handleSubmitBtnClick,
      isAddingBoardColumn,
      isFormDisabled,
      isOpen,
      onCloseComplete,
      touched.title,
      values,
    ]
  );
};
