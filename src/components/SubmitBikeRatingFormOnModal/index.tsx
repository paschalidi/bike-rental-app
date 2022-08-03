import React from 'react';
import { Box, Button, FormField, Heading, Layer, RangeInput } from 'grommet';
import { useFormik } from 'formik';
import { useBikes } from '../../contexts/bikes';

export const SubmitBikeRatingFormOnModal: React.FC<{
  onClose: () => void;
  uid: string;
}> = ({ onClose, uid }) => {
  const { editBikeRating } = useBikes();
  const {
    values,
    handleSubmit,
    isSubmitting,
    setErrors,
    setFieldValue,
    resetForm,
  } = useFormik({
    validateOnBlur: true,
    validateOnChange: false,
    initialValues: {
      uid: '',
      rating: '5',
    },
    onSubmit: async (formValues, { setSubmitting }) => {
      setSubmitting(true);
      try {
        await editBikeRating({
          uid: formValues.uid,
          rating: formValues.rating,
        });
      } catch (error) {
        setErrors({
          rating:
            'Something went wrong when rating this bike. Please refresh the page and try again!',
        });
      }
      setSubmitting(false);
    },
  });

  const handleModalClose = () => {
    onClose();
    resetForm();
  };

  return (
    <Layer key={uid} onEsc={handleModalClose} onClickOutside={handleModalClose}>
      <Box
        direction="column"
        border={{ color: 'brand', size: 'small' }}
        pad="medium"
      >
        <Box pad="small">
          <Heading>Rate bike</Heading>

          <form
            onSubmit={(e) => {
              setFieldValue('uid', uid);
              handleSubmit(e);
            }}
          >
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
              style={{
                marginTop: '20px',
                marginBottom: '8px',
                width: '100%',
              }}
              primary
              label="submit rating"
              type="submit"
              disabled={isSubmitting}
              aria-disabled={isSubmitting}
            />
          </form>
          <Button label="close" onClick={handleModalClose} />
        </Box>
      </Box>
    </Layer>
  );
};
