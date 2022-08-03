import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Button, CheckBox, FormField, Notification, RangeInput, TextInput } from 'grommet';
import { useBikes } from '../../contexts/bikes';

export const AddNewBikeForm = () => {
  const { addBike, formValidation } = useBikes();
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
    validateOnBlur: true,
    validateOnChange: false,
    initialValues: {
      model: '',
      color: '',
      location: '',
      available: false,
      rating: 5,
    },
    validate: formValidation,
    onSubmit: async (
      { model, rating, color, location, available },
      { setSubmitting }
    ) => {
      setSubmitting(true);
      try {
        await addBike({ model, rating, color, location, available });
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
          actions={[{ label: 'View all bikes', href: '/manager/bikes' }]}
          toast
          status="normal"
          title="You have added a new bike."
        />
      )}

      <form onSubmit={handleSubmit}>
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
