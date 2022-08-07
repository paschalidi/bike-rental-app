import { FormikValues, useFormik } from 'formik';
import { useRouter } from 'next/router';
import {
  Button,
  FormField,
  Notification,
  RadioButtonGroup,
  TextInput,
} from 'grommet';
import React, { useState } from 'react';
import { Auth } from 'firebase/auth';
import { Roles, useAuth } from '../../contexts/auth';

export const AddNewAccountForm = ({
  firebaseAuth,
  redirectAfterCreation = true,
}: {
  firebaseAuth: Auth;
  redirectAfterCreation?: boolean; // eslint-disable-line
}) => {
  const { signup, user } = useAuth();
  const router = useRouter();
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  const {
    handleChange,
    values,
    handleSubmit,
    errors,
    isSubmitting,
    setErrors,
    resetForm,
  } = useFormik({
    validateOnBlur: true,
    validateOnChange: false,
    initialValues: {
      email: '',
      password: '',
      role: Roles.Manager,
    },
    validate: (formValues: FormikValues) => {
      const formErrors: FormikValues = {};

      if (!formValues.password) {
        formErrors.password = 'Required';
      } else if (formValues.password.length < 5) {
        formErrors.password = 'Must be 5 characters or more';
      }

      if (!formValues.email) {
        formErrors.email = 'Required';
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formValues.email)
      ) {
        formErrors.email = 'Invalid email address';
      }

      return formErrors;
    },
    onSubmit: async ({ email, password, role }, { setSubmitting }) => {
      setSubmitting(true);
      try {
        setShowSuccessNotification(false);
        await signup({ firebaseAuth, email, password, role });
        if (redirectAfterCreation) {
          router.push(
            role === Roles.Manager ? '/manager/bikes' : '/user/bikes'
          );
        } else {
          resetForm();
          setShowSuccessNotification(true);
        }
      } catch (error) {
        setErrors({
          password: `Something went wrong. Please refresh the page and try again!`,
        });
      }
      setSubmitting(false);
    },
  });

  return (
    <>
      {showSuccessNotification && (
        <Notification
          toast
          status="normal"
          title="You have added a new account"
        />
      )}

      <form onSubmit={handleSubmit}>
        <FormField label="Email" error={errors.email}>
          <TextInput
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
          />
        </FormField>

        <FormField label="Password" error={errors.password}>
          <TextInput
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
          />
        </FormField>

        <RadioButtonGroup
          name="role"
          options={[Roles.Manager, Roles.User]}
          value={values.role}
          onChange={handleChange}
        />

        <Button
          style={{ marginTop: '40px' }}
          primary
          label="sign up"
          type="submit"
          disabled={isSubmitting}
          aria-disabled={isSubmitting}
        />

        {!user?.uid && (
          <Button
            onClick={() => router.push('/login')}
            style={{ marginTop: '40px', marginLeft: '8px' }}
            secondary
            label="log in now"
            disabled={isSubmitting}
            aria-disabled={isSubmitting}
          />
        )}
      </form>
    </>
  );
};
