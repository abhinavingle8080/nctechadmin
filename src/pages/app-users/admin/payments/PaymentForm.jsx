import dayjs from 'dayjs';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
// form
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

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

const PAYMENT_STATUS = {
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
  const { enqueueSnackbar } = useSnackbar();
  const [dueAmount, setDueAmount] = useState(0);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('Pending');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Online');

  const PaymentSchema = Yup.object().shape({
    student_name: Yup.string().required('Student name is required'),
    course_name: Yup.string().required('Course name is required'),
    course_amount: Yup.number()
      .required('Course amount is required')
      .min(0, 'Course amount must be non-negative'),
    date: Yup.string()
      .required('Date is required')
      .test('is-future-date', 'Date cannot be in the past', (value) => {
        if (!value) return false; // If date is not provided, fail validation
        const selectedDate = dayjs(value);
        const today = dayjs();
        return selectedDate.isAfter(today, 'day') || selectedDate.isSame(today, 'day'); // Validate if date is today or in the future
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
      student_name: data?.student_name || '',
      course_name: data?.course_name || '',
      course_amount: data?.course_amount || '',
      due_amount: data?.due_amount || '',
      date: data?.date ? dayjs(data?.date) : null,
      payment_status: data?.payment_status || 'Pending',
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
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, data, reset, defaultValues]);

  useEffect(() => {
    const calculateDueAmount = () => {
      const courseAmount = values.course_amount || 0;
      // Assuming there's some logic to determine the paid amount, replace 0 with the actual paid amount if needed.
      const paidAmount = 0;
      setDueAmount(courseAmount - paidAmount);
    };

    calculateDueAmount();
  }, [values.course_amount]);

  const onSubmit = async () => {
    try {
      const payload = { ...values, due_amount: dueAmount };
      if (isEdit) {
        await updatePaymentApi(payload)
          .then((res) => {
            enqueueSnackbar(res?.data?.message);
            formClear();
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
    reset(defaultValues);
    setSelectedPaymentStatus('Pending');
    setSelectedPaymentMethod('Online');
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
                  onChange={(e) => setValue('course_id', e.target.value)}
                  value={values.course_id}
                  isError={!!errors.course_id}
                  errorText={errors.course_id?.message}
                  isRequired
                />
                <RHFTextField name="course_amount" label="Course Amount" type="number" required />
                <RHFTextField name="due_amount" label="Due Amount" value={dueAmount} disable />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <StyledDatePicker
                    label="Date"
                    name="date"
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
