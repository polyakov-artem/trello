import type { FC } from 'react';
import { Formik, Field, Form } from 'formik';
import { Button, Input } from 'antd';
import type { PropsWithClassName } from '@/shared/types/types';
import * as Yup from 'yup';
import { AvatarSelector, useUserCreationStore } from '@/entities/user';
import clsx from 'clsx';
import { useRegisterUser } from '../model/useRegisterUser';

const signupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters long')
    .max(20, 'Name must be no longer than 20 characters')
    .required('Name is required'),
  avatarId: Yup.string().required('Avatar is required'),
});

export const FormRegistration: FC<PropsWithClassName> = ({ className }) => {
  const { registerUser } = useRegisterUser();
  const checkIfCreatingUser = useUserCreationStore.use.checkIfLoading();
  const isCreatingUser = useUserCreationStore.use.isLoading();

  return (
    <Formik
      initialValues={{
        name: '',
        avatarId: '',
      }}
      validationSchema={signupSchema}
      onSubmit={async (values, { setFieldError, resetForm }) => {
        if (checkIfCreatingUser()) {
          return;
        }

        const result = await registerUser(values);

        if (!result) {
          return;
        }

        if (!result.ok) {
          const errors = result.error.errors;

          if (errors) {
            errors.forEach((error) => {
              setFieldError(error.field, error.message);
            });
          }

          return;
        }

        resetForm();
      }}>
      {({ values, handleChange, errors, touched }) => (
        <Form className={clsx('flex gap-4 flex-col', className)}>
          <div>
            <label className="font-bold mb-2 block" htmlFor="name">
              Name
            </label>

            <Field as={Input} id="name" name="name" placeholder="Name" />
            <p className="text-red-500 text-sm leading-[1] ">
              {touched.name ? errors.name : ''}&nbsp;
            </p>
          </div>

          <div>
            <label className="font-bold mb-2 block">Avatar</label>
            <AvatarSelector
              name="avatarId"
              checkedValue={values.avatarId}
              onChange={handleChange}
              error={touched.avatarId ? errors.avatarId : ''}
            />
          </div>

          <Button
            className="self-center"
            type="primary"
            htmlType="submit"
            loading={isCreatingUser}
            iconPosition={'end'}>
            Register
          </Button>
        </Form>
      )}
    </Formik>
  );
};
