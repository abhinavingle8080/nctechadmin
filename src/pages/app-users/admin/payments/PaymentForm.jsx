import dayjs from 'dayjs';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import moment from 'moment';

// form
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// @mui
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Card, Grid, styled, Typography } from '@mui/material';

// components
import StudentSelect from 'src/components/select/StudentSelect';
import CourseSelect from 'src/components/select/CourseSelect';
import { FormBox, FormBottomButton } from '../../../../sections/@dashboard/user/form';
import { RHFSelect, RHFTextField, FormProvider } from '../../../../components/hook-form';
import { createPaymentApi, updatePaymentApi } from '../../../../apis/admin/payment/PaymentsApis';
import  useAuth  from '../../../../hooks/useAuth';


// ----------------------------------------------------------------------

PaymentForm.propTypes = {
  isEdit: PropTypes.bool,
  data: PropTypes.object,
};

const StyledDatePicker = styled(DatePicker)(() => ({
  '& .MuiInputLabel-asterisk': {
    color: 'red',
  },
}));

export const PAYMENT_STATUS = {
  Completed: 'Completed',
  Pending: 'Pending',
  Failed: 'Failed',
};

const PAYMENT_METHOD = {
  Online: 'Online',
  Cash: 'Cash',
  Cheque: 'Cheque',
};

export default function PaymentForm({ isEdit, data }) {
  const navigate = useNavigate(); // Define the navigate function
  const { user, logout } = useAuth();

  const { enqueueSnackbar } = useSnackbar();
  const [dueAmount, setDueAmount] = useState(0);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('Completed');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Online');
  const [selectedCourse, setSelectedCourse] = useState(null);

  const PaymentSchema = Yup.object().shape({
    student_id: Yup.string().required('Student is required'),
    course_id: Yup.string().required('Course is required'),
    course_amount: Yup.number()
      .required('Course amount is required')
      .min(0, 'Course amount must be non-negative'),
    date: Yup.string()
      .required('Date is required')
      .test('is-past-date', 'Date cannot be in the Future', (value) => {
        if (!value) return false; // If date is not provided, fail validation
        const selectedDate = dayjs(value);
        const today = dayjs();
        return selectedDate.isBefore(today, 'day') || selectedDate.isSame(today, 'day'); // Validate if date is today or in the future
      }),
    payment_status: Yup.string()
      .oneOf(Object.values(PAYMENT_STATUS))
      .required('Payment status is required'),
    payment_method: Yup.string()
      .oneOf(Object.values(PAYMENT_METHOD))
      .required('Payment method is required'),
  });

  const defaultValues = useMemo(
    () => ({
      payment_id: data?.id,
      student_id: data?.student_id || '',
      course_id: data?.course_id || '',
      course_amount: data?.course_amount || '',
      paid_amount: data?.paid_amount || '',
      due_amount: data?.due_amount || '',
      date: data?.date ? dayjs(data?.date) : dayjs(moment().format('YYYY-MM-DD')),
      payment_status: data?.payment_status || 'Completed',
      payment_method: data?.payment_method || 'Online',
    }),
    [data]
  );

  const methods = useForm({
    resolver: yupResolver(PaymentSchema),
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
      setSelectedPaymentStatus(data.payment_status);
      setSelectedPaymentMethod(data.payment_method);
      setSelectedCourse({
        value: data?.Course?.id,
        label: data?.Course?.course_name,
        fees: data?.Course?.discount_fees,
      });
      setValue('course_amount', data?.Course?.discount_fees);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [isEdit, data]);

  useEffect(() => {
    const calculateDueAmount = () => {
      const courseAmount = values.course_amount || 0;
      const paidAmount = values.paid_amount || 0;
      setDueAmount(courseAmount - paidAmount);
    };

    calculateDueAmount();
  }, [values.course_amount, values.paid_amount]);

  const onSubmit = async (formValues) => {
    try {
      const payload = { ...formValues, due_amount: dueAmount };
      if (isEdit) {
        await updatePaymentApi(payload)
          .then((res) => {
            enqueueSnackbar(res?.data?.message);
            formClear();
            navigate('/admin/payments');
          })
          .catch((err) => {
            console.error(err);
            enqueueSnackbar(err?.response?.data?.message, { variant: 'error' });
          });
      } else {
        await createPaymentApi(payload)
          .then((res) => {
            enqueueSnackbar(res?.data?.message, { variant: 'success' });
            formClear();
            navigate('/admin/payments');
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
      setSelectedPaymentStatus(data?.payment_status);
      setSelectedPaymentMethod(data?.payment_method);
    } else {
      reset();
      setSelectedPaymentStatus('Completed');
      setSelectedPaymentMethod('Online');
    }
  };

  const handleCourseChanges = (course) => {
    console.log('Selected course:', course);
    setSelectedCourse({
      value: course.value,
      label: course.label,
      fees: course.fees,
    });
    setValue('course_id', course.value);
    setValue('course_amount', course.fees);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Typography sx={{ p: 2 }} color="#FF4842" fontSize={13}>
              All fields marked with * are mandatory
            </Typography>
            <Typography>  {user.first_name}  </Typography> 
            <form noValidate>
              <FormBox>
                <StudentSelect
                  name="student_id"
                  label="Student"
                  onChange={(e) => setValue('student_id', e.target.value)}
                  value={values.student_id}
                  isError={!!errors.student_id}
                  errorText={errors.student_id?.message}
                  isRequired
                />
                <CourseSelect
                  name="course_id"
                  label="Course"
                  onChange={(course) => handleCourseChanges(course)}
                  value={selectedCourse}
                  isError={!!errors.course_id}
                  errorText={errors.course_id?.message}
                  isRequired
                />
                <RHFTextField name="course_amount" label="Course Amount" type="number" required />
                <RHFTextField name="paid_amount" label="Paid Amount" type="number" required />
                <RHFTextField name="due_amount" label="Due Amount" value={dueAmount} readOnly />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <StyledDatePicker
                  maxDate={dayjs()}
                    label="Date"
                    name="payment_date"
                    value={values?.date}
                    onChange={(e) => setValue('date', e)}
                    format="YYYY-MM-DD"
                    slotProps={{
                      textField: {
                        helperText: errors.date ? errors.date.message : null,
                        error: Boolean(errors.date),
                        required: true,
                      },
                    }}
                  />
                </LocalizationProvider>
                <RHFSelect
                  name="payment_status"
                  label="Payment Status"
                  value={selectedPaymentStatus}
                  onChange={(e) => {
                    setSelectedPaymentStatus(e.target.value);
                    setValue('payment_status', e.target.value);
                  }}
                  required
                >
                  {Object.entries(PAYMENT_STATUS).map(([key, value]) => (
                    <option key={key} value={value}>
                      {key}
                    </option>
                  ))}
                </RHFSelect>
                <RHFSelect
                  name="payment_method"
                  label="Payment Method"
                  value={selectedPaymentMethod}
                  onChange={(e) => {
                    setSelectedPaymentMethod(e.target.value);
                    setValue('payment_method', e.target.value);
                  }}
                  required
                >
                  {Object.entries(PAYMENT_METHOD).map(([key, value]) => (
                    <option key={key} value={value}>
                      {key}
                    </option>
                  ))}
                </RHFSelect>
              </FormBox>
            </form>

            <FormBottomButton
              cancelButton='/admin/payments'
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
