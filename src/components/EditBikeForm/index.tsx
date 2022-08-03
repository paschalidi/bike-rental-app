import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Button, CheckBox, FormField, Notification, RangeInput, TextInput } from 'grommet';
import { BikeInfo, useBikes } from '../../contexts/bikes';

export const EditBikeForm = ({
  model,
  color,
  location,
  available,
  rating,
  uid,
}: BikeInfo) => {
  const { editBike, formValidation } = useBikes();
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  const {
    handleChange,
    values,
    handleSubmit,
    errors,
    isSubmitting,
    setErrors,
    setFieldValue,
  } = useFormik({
    validateOnBlur: true,
    validateOnChange: false,
    initialValues: {
      model,
      color,
      location,
      available,
      rating,
    },
    validate: formValidation,
    onSubmit: async (formValues, { setSubmitting }) => {
      setSubmitting(true);
      try {
        await editBike({
          model: formValues.model,
          rating: formValues.rating,
          color: formValues.color,
          location: formValues.location,
          available: formValues.available,
          uid,
        });
        setShowSuccessNotification(true);
      } catch (error) {
        setErrors({
          rating:
            'Something went wrong when editing this bike. Please refresh the page and try again!',
        });
      }
      setSubmitting(false);
    },
  });

  return (
    <>
      {showSuccessNotification && (
        <Notification toast status="normal" title="Edit is successful 🥳" />
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

        <FormField label={`Rating ${values.rating && values.rating}`}>
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
