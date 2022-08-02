import type { NextPage } from 'next';
import { Box, Button, FormField, Heading, RadioButtonGroup, TextInput } from 'grommet';
import React from 'react';
import type { FormikValues } from 'formik';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { Roles, useAuth } from '../contexts/auth';

const validate = (values: FormikValues) => {
  const errors: FormikValues = {};

  if (!values.password) {
    errors.password = 'Required';
  } else if (values.password.length < 5) {
    errors.password = 'Must be 5 characters or more';
  }

  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }

  return errors;
};

const SignupForm = () => {
  const { signup, } = useAuth();
  const router = useRouter();

  const {
    handleChange,
    values,
    handleSubmit,
    errors,
    isSubmitting,
    setErrors,
  } = useFormik({
    initialValues: {
      email: '',
      password: '',
      role: Roles.Manager,
    },
    validate,
    onSubmit: async ({ email, password, role }, { setSubmitting }) => {
      setSubmitting(true);
      try {
        await signup?.({ email, password, role });
        router.push('/');
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

      <RadioButtonGroup
        name="role"
        options={[Roles.Manager, Roles.User]}
        value={values.role}
        onChange={handleChange}
      />

      <Button
        style={{marginTop: '40px'}}
        primary
        label="sign up"
        type="submit"
        disabled={isSubmitting}
        aria-disabled={isSubmitting}
      />
    </form>
  );
};

const SignUp: NextPage = () => (
  <Box align="center">
    <Box width="medium" margin="large">
      <Heading>sign up</Heading>
      <SignupForm />
    </Box>
  </Box>
);

export default SignUp;
