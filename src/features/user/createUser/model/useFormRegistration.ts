import { useCallback, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRegisterUser } from './useRegisterUser';
import { isFetchError } from '@/shared/lib/safeFetch';

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
  const { registerUser, isRegistering, canCreateUser } = useRegisterUser();

  const [formError, setFormError] = useState('');

  const formik = useFormik({
    initialValues: defaultFormState,
    validationSchema: signupSchema,
    onSubmit: async (values, { resetForm, setFieldError }) => {
      try {
        setFormError('');
        await registerUser(values);
        resetForm();
      } catch (e) {
        if (isFetchError(e)) {
          if (e.errors) {
            e.errors.forEach((error) => {
              setFieldError(error.field, error.message);
            });
          } else {
            setFormError(e.message);
          }
        }
      }
    },
  });

  const { values, touched, errors, handleSubmit, setFieldValue } = formik;

  const handleFieldChange = useCallback(
    (name: string, value: string[] | string | boolean) => {
      setFormError('');
      void setFieldValue(name, value);
    },
    [setFieldValue]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
      handleFieldChange(e.target.name, e.target.value);
    },
    [handleFieldChange]
  );

  return useMemo(
    () => ({
      values,
      formError,
      isRegistering,
      nameError: errors.name && touched.name ? errors.name : '',
      avatarError: errors.avatarId && touched.avatarId ? errors.avatarId : '',
      handleInputChange,
      handleSubmit,
      isFormDisabled: !canCreateUser,
    }),
    [
      canCreateUser,
      errors.avatarId,
      errors.name,
      formError,
      handleInputChange,
      handleSubmit,
      isRegistering,
      touched.avatarId,
      touched.name,
      values,
    ]
  );
};
