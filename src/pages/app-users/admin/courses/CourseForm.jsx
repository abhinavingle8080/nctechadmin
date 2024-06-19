import dayjs from 'dayjs';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
// form
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Card, Grid, styled, Typography, FormHelperText } from '@mui/material';

// components
import { FormBox, FormBottomButton } from '../../../../sections/@dashboard/user/form';
import { RHFSelect, FormProvider, RHFTextField } from '../../../../components/hook-form';
import { createCourseApi, updateCourseApi } from '../../../../apis/admin/course/CourseApis';
import { SELECT_STATUS } from '../../../../data/constants';

// ----------------------------------------------------------------------

CourseForm.propTypes = {
  isEdit: PropTypes.bool,
  data: PropTypes.object,
};

const StyledDatePicker = styled(DatePicker)(() => ({
  '& .MuiInputLabel-asterisk': {
    color: 'red',
  },
}));

export default function CourseForm({ isEdit, data }) {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState('Active');

  const { enqueueSnackbar } = useSnackbar();

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
  });

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
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, selectedStatus]
  );

  const handleChange = (e, name, state) => {
    state(e.target.value);
    setValue(name, e.target.value);
  };

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

  const values = watch();

  useEffect(() => {
    if (isEdit && data) {
      reset(defaultValues);
      if (data.status !== undefined && data.status !== null) {
        setSelectedStatus(data.status);
     } 
    } else {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, data, defaultValues, reset]);

  const onSubmit = async () => {
    try {
      if (isEdit) {
        await updateCourseApi(values)
          .then((res) => {
            enqueueSnackbar(res?.data?.message);
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

  const formClear = () => {
    if (isEdit) {
      reset(defaultValues);
      setSelectedStatus(data?.status);
    } else {
      reset();
      setSelectedStatus('Active');
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
                <RHFTextField name="course_name" label="Course Name" required />
                <RHFTextField name="description" label="Description" multiline rows={3} required />
                <RHFTextField name="fees" label="Fees" required />
                <RHFTextField name="discount_fees" label="Discount Fees" />
                <RHFTextField name="duration" label="Duration (days)" />
                <RHFTextField name="location" label="Location" />
                <RHFTextField name="max_capacity" label="Max Capacity" />
                <RHFTextField name="current_capacity" label="Current Capacity" />

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <StyledDatePicker
                    label="Start Date"
                    name="start_date"
                    value={values?.start_date}
                    onChange={(e) => {
                      setValue('start_date', e);
                    }}
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
                    onChange={(e) => {
                      setValue('end_date', e);
                    }}
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

                <RHFSelect
                  name="status"
                  label="Status"
                  value={selectedStatus}
                  onChange={(e) => handleChange(e, 'status', setSelectedStatus)}
                >
                  {Object.entries(SELECT_STATUS).map(([key, value]) => (
                    <option key={key} value={value}>
                      {key}
                    </option>
                  ))}
                </RHFSelect>
              </FormBox>
            </form>

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