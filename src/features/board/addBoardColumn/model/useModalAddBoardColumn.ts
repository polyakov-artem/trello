import { useCallback, useEffect, useMemo, useState } from 'react';
import { useBoardUpdateStore } from '@/entities/board';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useAddBoardColumnContext } from './AddBoardColumnContext';
import { useAddBoardColumn } from './useAddBoardColumn';
import { useCanAddBoardColumn } from './guards';

export const defaultFormState = {
  title: '',
};

const schema = Yup.object().shape({
  title: Yup.string()
    .min(2, 'Title must be at least 2 characters long')
    .max(20, 'Title must be no longer than 20 characters')
    .required('Title is required'),
});

export const useModalAddBoardColumn = () => {
  const { closeModal, isOpen, onCloseComplete, details } = useAddBoardColumnContext();
  const boardId = details?.boardId;
  const [formError, setFormError] = useState('');
  const addBoardColumn = useAddBoardColumn();

  const isProcessing = useBoardUpdateStore.use.isLoading();
  const canAddBoardColumn = useCanAddBoardColumn();

  const handleCloseModal = useCallback(() => {
    setFormError('');
    closeModal();
  }, [closeModal]);

  const formik = useFormik({
    initialValues: defaultFormState,
    validationSchema: schema,
    onSubmit: async (values) => {
      if (!boardId) {
        return;
      }

      const result = await addBoardColumn({
        boardId,
        columnDraft: values,
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
    if (!isOpen) {
      void resetForm();
    }
  }, [isOpen, setValues, resetForm]);

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
  const isFormDisabled = isProcessing || !canAddBoardColumn;

  return useMemo(
    () => ({
      isProcessing,
      closeModal: handleCloseModal,
      isOpen,
      isFormDisabled,
      onCloseComplete,
      formError,
      titleError: formik.errors.title && formik.touched.title ? formik.errors.title : '',
      values: formik.values,
      handleInputChange,
      handleSubmit: formik.handleSubmit,
      handleSubmitBtnClick,
    }),
    [
      formError,
      formik.errors.title,
      formik.handleSubmit,
      formik.touched.title,
      formik.values,
      handleCloseModal,
      handleInputChange,
      handleSubmitBtnClick,
      isFormDisabled,
      isOpen,
      isProcessing,
      onCloseComplete,
    ]
  );
};
