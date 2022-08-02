import type { NextPage } from 'next';
import {
  Box,
  Button,
  CheckBox,
  FormField,
  Grid,
  Notification,
  Page,
  PageContent,
  RangeInput,
  TextInput
} from 'grommet';
import React, { useState } from 'react';
import type { FormikValues } from 'formik';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { TopBar } from '../../components/TopBar';
import { useBikes } from '../../contexts/bikes';
import { SideNav } from '../../components/SideNav';

const validate = (values: FormikValues) => {
  const errors: FormikValues = {};

  if (!values.model) {
    errors.model = 'Required';
  } else if (values.model.length < 3) {
    errors.model = 'Must be 3 characters or more';
  }

  if (!values.color) {
    errors.color = 'Required';
  } else if (values.color.length < 3) {
    errors.color = 'Must be 3 characters or more';
  }

  if (!values.location) {
    errors.location = 'Required';
  } else if (values.location.length < 3) {
    errors.location = 'Must be 3 characters or more';
  }

  if (!values.rating) {
    errors.rating = 'Required';
  }

  if (!values.available) {
    errors.available = 'Required';
  }
  return errors;
};

const AddNewBikeForm = () => {
  const { addBike } = useBikes();
  const router = useRouter();
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  const {
    handleChange,
    values,
    handleSubmit,
    errors,
    isSubmitting,
    setErrors,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues: {
      model: '',
      color: '',
      location: '',
      available: false,
      rating: 5,
    },
    validate,
    onSubmit: async (
      { model, rating, color, location, available },
      { setSubmitting }
    ) => {
      setSubmitting(true);
      try {
        await addBike?.({ model, rating, color, location, available });
        setShowSuccessNotification(true);
        resetForm();
      } catch (error) {
        setErrors({
          rating:
            'Something went wrong. Please refresh the page and try again!',
        });
      }
      setSubmitting(false);
    },
  });

  return (
    <>
      {showSuccessNotification && (
        <Notification
          actions={[{ label: 'View all bikes', href: '/manager/dashboard' }]}
          toast
          status="normal"
          title="You have added a new bike."
        />
      )}
      <form onSubmit={handleSubmit} style={{ marginTop: '10vh' }}>
        <FormField label="Model" error={errors.model}>
          <TextInput
            name="model"
            value={values.model}
            onChange={handleChange}
          />
        </FormField>

        <FormField label="Color" error={errors.color}>
          <TextInput
            name="color"
            value={values.color}
            onChange={handleChange}
          />
        </FormField>

        <FormField label="Location" error={errors.location}>
          <TextInput
            name="location"
            value={values.location}
            onChange={handleChange}
          />
        </FormField>

        <FormField label="Available for rental" error={errors.available}>
          <CheckBox
            checked={values.available}
            label="Is available"
            onChange={(e) => {
              const { checked } = e.target;
              setFieldValue('available', checked);
            }}
          />
        </FormField>

        <FormField
          label={`Rating ${values.rating && values.rating}`}
          error={errors.rating}
        >
          <RangeInput
            min={1}
            max={5}
            step={0.1}
            value={values.rating}
            onChange={(e) => {
              const { value } = e.target;
              setFieldValue('rating', value);
            }}
          />
        </FormField>

        <Button
          style={{ marginTop: '40px' }}
          primary
          label="add new bike"
          type="submit"
          disabled={isSubmitting}
          aria-disabled={isSubmitting}
        />
      </form>
    </>
  );
};

const ManagerDashboard: NextPage = () => (
  <Grid
    fill
    rows={['auto', 'flex']}
    columns={['auto', 'flex']}
    areas={[
      { name: 'header', start: [0, 0], end: [1, 0] },
      { name: 'sidebar', start: [0, 1], end: [0, 1] },
      { name: 'main', start: [1, 1], end: [1, 1] },
    ]}
  >
    <Box gridArea="header" background="brand">
      <TopBar />
    </Box>
    <Box gridArea="sidebar" background="light-5">
      <SideNav />
    </Box>
    <Box gridArea="main">
      <Page kind="narrow">
        <PageContent>
          <AddNewBikeForm />
        </PageContent>
      </Page>
    </Box>
  </Grid>
);

export default ManagerDashboard;
