import { useCallback, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useUserCreationStore } from '@/entities/user';
import { useRegisterUser } from './useRegisterUser';
import { useCanCreateUser } from './guards';

const signupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters long')
    .max(20, 'Name must be no longer than 20 characters')
    .required('Name is required'),
  avatarId: Yup.string().required('Avatar is required'),
});

const defaultFormState = {
  name: '',
  avatarId: '',
};

export const useFormRegistration = () => {
  const registerUser = useRegisterUser();
  const isCreatingUser = useUserCreationStore.use.isLoading();
  const canCreateUser = useCanCreateUser();

  const [formError, setFormError] = useState('');

  const formik = useFormik({
    initialValues: defaultFormState,
    validationSchema: signupSchema,
    onSubmit: async (values, { resetForm, setFieldError }) => {
      const result = await registerUser(values, () => setFormError(''));

      if (!result) {
        return;
      }

      if (result.ok === true) {
        resetForm();
        return;
      }

      const errors = result.error.errors;

      if (errors) {
        errors.forEach((error) => {
          setFieldError(error.field, error.message);
        });
      } else {
        setFormError(result.error.message);
      }
    },
  });

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

  return useMemo(
    () => ({
      values: formik.values,
      formError,
      isCreatingUser,
      nameError: formik.errors.name && formik.touched.name ? formik.errors.name : '',
      avatarError: formik.errors.avatarId && formik.touched.avatarId ? formik.errors.avatarId : '',
      handleInputChange,
      handleSubmit: formik.handleSubmit,
      isGlobalDisabled: !canCreateUser,
    }),
    [
      canCreateUser,
      formError,
      formik.errors.avatarId,
      formik.errors.name,
      formik.handleSubmit,
      formik.touched.avatarId,
      formik.touched.name,
      formik.values,
      handleInputChange,
      isCreatingUser,
    ]
  );
};
