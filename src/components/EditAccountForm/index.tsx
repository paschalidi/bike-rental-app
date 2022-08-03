import { FormikValues, useFormik } from 'formik';
import { Button, FormField, Notification, RadioButtonGroup, TextInput } from 'grommet';
import React, { useState } from 'react';
import { Roles } from '../../contexts/auth';
import { AccountInfo, useAccounts } from '../../contexts/accounts';

export const EditAccountForm = ({ email, role, uid }: AccountInfo) => {
  const { editAccount } = useAccounts();
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

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
      email,
      role,
    },
    validate: (formValues: FormikValues) => {
      const formErrors: FormikValues = {};

      if (!formValues.email) {
        formErrors.email = 'Required';
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formValues.email)
      ) {
        formErrors.email = 'Invalid email address';
      }

      return formErrors;
    },
    onSubmit: async (formValues, { setSubmitting }) => {
      setSubmitting(true);
      try {
        await editAccount({
          email: formValues.email,
          role: formValues.role,
          uid,
        });
        setShowSuccessNotification(true);
      } catch (error) {
        setErrors({
          role: 'Something went wrong when editing this account holder. Please refresh the page and try again!',
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
          title="Edit is successful 🥳"
        />
      )}

      <form onSubmit={handleSubmit}>
        <FormField label="Email" error={errors.email}>
          <TextInput
            disabled
            name="email"
            type="email"
            value={values.email}
          />
        </FormField>

        <RadioButtonGroup
          name="role"
          options={[Roles.Manager, Roles.User]}
          value={values.role}
          onChange={handleChange}
        />

        <Button
          style={{ marginTop: '20px', marginBottom: '8px', width: '100%' }}
          primary
          label="save changes"
          type="submit"
          disabled={isSubmitting}
          aria-disabled={isSubmitting}
        />
      </form>
    </>
  );
};
