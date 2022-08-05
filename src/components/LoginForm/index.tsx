import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { Button, FormField, TextInput } from 'grommet';
import React from 'react';
import { useAuth } from '../../contexts/auth';

export const LoginForm = () => {
  const { login } = useAuth();
  const router = useRouter();

  const {
    handleChange,
    values,
    handleSubmit,
    errors,
    isSubmitting,
    setErrors,
  } = useFormik({
    validateOnBlur: true,
    validateOnChange: false,
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ email, password }, { setSubmitting }) => {
      setSubmitting(true);
      try {
        await login({ email, password });
        router.push("/");
      } catch (error) {
        setErrors({
          password: `Something went wrong. Please refresh the page and try again!`,
        });
      }
      setSubmitting(false);
    },
  });

  return (
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

      <Button
        style={{ marginTop: '40px' }}
        primary
        label="login"
        type="submit"
        disabled={isSubmitting}
        aria-disabled={isSubmitting}
      />

      <Button
        onClick={() => router.push('/signup')}
        style={{ marginTop: '40px', marginLeft: '8px' }}
        secondary
        label="sign up now"
        disabled={isSubmitting}
        aria-disabled={isSubmitting}
      />
    </form>
  );
};
