import dayjs from 'dayjs';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Card, Grid, styled, Typography } from '@mui/material';

// Components
import { FormBox, FormBottomButton } from '../../../../sections/@dashboard/user/form';
import { RHFSelect, FormProvider, RHFTextField } from '../../../../components/hook-form';
import { createCourseApi, updateCourseApi } from '../../../../apis/admin/course/CourseApis';
import { SELECT_TYPE, SELECT_STATUS } from '../../../../data/constants';

// PropTypes
CourseForm.propTypes = {
  isEdit: PropTypes.bool,
  data: PropTypes.object,
};

// Styled component for MUI DatePicker
const StyledDatePicker = styled(DatePicker)(() => ({
  '& .MuiInputLabel-asterisk': {
    color: 'red',
  },
}));

// CourseForm Component
export default function CourseForm({ isEdit, data }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedStatus, setSelectedStatus] = useState('Active');
  const [selectedType, setSelectedType] = useState('Online');

  // Validation schema for Course form
  const CourseSchema = Yup.object().shape({
    course_name: Yup.string().required('Course name is required'),
    description: Yup.string().required('Description is required'),
    fees: Yup.number().required('Fees are required').typeError('Fees must be a number'),
    discount_fees: Yup.number().typeError('Discount fees must be a number'),
    duration: Yup.number().typeError('Duration must be a number'),
    start_date: Yup.string().required('Start date is required'),
    end_date: Yup.string().required('End date is required'),
    location: Yup.string(),
    max_capacity: Yup.number().typeError('Max capacity must be a number'),
    current_capacity: Yup.number().typeError('Current capacity must be a number'),
    status: Yup.string().oneOf(Object.values(SELECT_STATUS)).required('Status is required'),
    type: Yup.string().oneOf(Object.values(SELECT_TYPE)).required('Type is required'),
  });

  // Default form values
  const defaultValues = useMemo(
    () => ({
      course_id: data?.id || '',
      course_name: data?.course_name || '',
      description: data?.description || '',
      fees: data?.fees || '',
      discount_fees: data?.discount_fees || '',
      duration: data?.duration || '',
      start_date: data?.start_date ? dayjs(data?.start_date) : null,
      end_date: data?.end_date ? dayjs(data?.end_date) : null,
      location: data?.location || '',
      max_capacity: data?.max_capacity || '',
      current_capacity: data?.current_capacity || '',
      status: data?.status || selectedStatus,
      type: data?.type || selectedType,
    }),
    [data, selectedStatus, selectedType]
  );

  // Form methods from react-hook-form
  const methods = useForm({
    resolver: yupResolver(CourseSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = methods;

  const values = watch(); // Watch for form values changes

  // Effect to reset form on edit or initialize with default values
  useEffect(() => {
    if (isEdit && data) {
      reset(defaultValues);
      if (data.status !== undefined && data.status !== null) {
        setSelectedStatus(data.status);
      }
      if (data.type !== undefined && data.type !== null) {
        setSelectedType(data.type);
      }
    } else {
      reset(defaultValues);
    }
  }, [isEdit, data, defaultValues, reset]);

  // Handle form submission
  const onSubmit = async () => {
    try {
      if (isEdit) {
        await updateCourseApi(values)
          .then((res) => {
            enqueueSnackbar(res?.data?.message, { variant: 'success' });
            formClear();
            navigate('/admin/courses');
          })
          .catch((err) => {
            console.error(err);
            enqueueSnackbar(err?.response?.data?.message, { variant: 'error' });
          });
      } else {
        await createCourseApi(values)
          .then((res) => {
            enqueueSnackbar(res?.data?.message, { variant: 'success' });
            formClear();
            navigate('/admin/courses');
          })
          .catch((err) => {
            console.error(err);
            enqueueSnackbar(err?.response?.data?.message, { variant: 'error' });
          });
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error?.response?.data?.message, { variant: 'error' });
    }
  };

  // Clear form values and reset state
  const formClear = () => {
    if (isEdit) {
      reset(defaultValues);
      setSelectedStatus(data?.status);
      setSelectedType(data?.type);
    } else {
      reset();
      setSelectedStatus('Active');
      setSelectedType('Online');
    }
  };

  // Handle change events for form inputs
  const handleChange = (e, name, state) => {
    state(e.target.value);
    setValue(name, e.target.value);
  };

  // Handle start date change and calculate end date
  const onStartDateChange = (newValue) => {
    setValue('start_date', newValue);
    if (values.duration) {
      const numDuration = parseInt(values.duration, 10);
      const newEndDate = dayjs(newValue).add(numDuration, 'day');
      setValue('end_date', newEndDate);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Typography sx={{ p: 2 }} color="#FF4842" fontSize={13}>
              All fields marked with * are mandatory
            </Typography>
            <form noValidate>
              <FormBox>
                <RHFTextField name="course_name" label="Course Name" required InputLabelProps={{ required: true }} />
                <RHFTextField name="description" label="Description" multiline rows={3} required InputLabelProps={{ required: true }} />
                <RHFTextField name="fees" label="Fees" required InputLabelProps={{ required: true }} />
                <RHFTextField name="discount_fees" label="Discount Fees" InputLabelProps={{ required: true }} />
                <RHFTextField name="duration" label="Duration (days)" InputLabelProps={{ required: true }} />
                <RHFTextField name="location" label="Location" InputLabelProps={{ required: true }} />
                <RHFTextField name="max_capacity" label="Max Capacity" InputLabelProps={{ required: true }} />

                {/* Date pickers for start date and end date */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <StyledDatePicker
                    label="Start Date"
                    name="start_date"
                    value={values?.start_date}
                    onChange={(e) => onStartDateChange(e)}
                    format="YYYY-MM-DD"
                    slotProps={{
                      textField: {
                        helperText: errors.start_date ? errors.start_date.message : null,
                        error: Boolean(errors.start_date),
                        required: true,
                      },
                    }}
                  />
                </LocalizationProvider>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <StyledDatePicker
                    label="End Date"
                    name="end_date"
                    value={values?.end_date}
                    onChange={(e) => setValue('end_date', e)}
                    format="YYYY-MM-DD"
                    slotProps={{
                      textField: {
                        helperText: errors.end_date ? errors.end_date.message : null,
                        error: Boolean(errors.end_date),
                        required: true,
                      },
                    }}
                  />
                </LocalizationProvider>

                {/* Select inputs for status and type */}
                <RHFSelect
                  name="status"
                  label="Status"
                  value={selectedStatus}
                  onChange={(e) => handleChange(e, 'status', setSelectedStatus)}
                  InputLabelProps={{ required: true }}
                >
                  {Object.entries(SELECT_STATUS).map(([key, value]) => (
                    <option key={key} value={value}>
                      {key}
                    </option>
                  ))}
                </RHFSelect>

                <RHFSelect
                  name="type"
                  label="Type"
                  value={selectedType}
                  onChange={(e) => handleChange(e, 'type', setSelectedType)}
                  InputLabelProps={{ required: true }}
                >
                  {Object.entries(SELECT_TYPE).map(([key, value]) => (
                    <option key={key} value={value}>
                      {key}
                    </option>
                  ))}
                </RHFSelect>
              </FormBox>
            </form>

            {/* Component for form bottom actions */}
            <FormBottomButton
              cancelButton="/admin/courses"
              onClear={() => formClear()}
              isSubmitting={isSubmitting}
              isEdit={isEdit}
            />
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
