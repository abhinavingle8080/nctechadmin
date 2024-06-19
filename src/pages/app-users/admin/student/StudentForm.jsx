import dayjs from 'dayjs';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import 'react-phone-number-input/style.css';
import { useNavigate } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import PhoneInput, { parsePhoneNumber } from 'react-phone-number-input';

// @mui
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Card, Grid, styled, Typography, FormHelperText } from '@mui/material';

// components
import '../../../../assets/css/PhoneInput.css';
import DesignationSelect from 'src/components/select/DesignationSelect';
import { FormBox, FormBottomButton } from '../../../../sections/@dashboard/user/form';
import { RHFSelect, FormProvider, RHFTextField } from '../../../../components/hook-form';
import { createStudentApi, updateStudentApi } from '../../../../apis/admin/student/StudentApis';
import { SELECT_STATUS } from '../../../../data/constants';

// ----------------------------------------------------------------------

StudentForm.propTypes = {
  isEdit: PropTypes.bool,
  data: PropTypes.object,
};

const StyledDatePicker = styled(DatePicker)(() => ({
  '& .MuiInputLabel-asterisk': {
    color: 'red',
  },
}));

export default function StudentForm({ isEdit, data }) {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState('Active');
  const [phoneNo, setPhoneNo] = useState('');
  const [parentsContactNo, setParentsContactNo] = useState('');

  const { enqueueSnackbar } = useSnackbar();

  const StudentSchema = Yup.object().shape({
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    email: Yup.string()
      .email('Invalid email')
      .required('Email is required'),
    birth_date: Yup.string()
      .nullable()
      .required('Date of birth is required')
      .test('is-adult', 'Student must be 18 years or older', (value) => {
        if (!value) return false;
        const birthDate = dayjs(value);
        const today = dayjs();
        const age = today.diff(birthDate, 'years');
        return age >= 18;
      }),
    phone_no: Yup.string()
      .required('Phone number is required')
      .test('phone_no', 'Invalid phone number', (value) => {
        if (value === null || value === undefined) {
          return true;
        }
        return /^\d{10}$/.test(value) && value.length >= 10 && value.length <= 14;
      }),
    parents_contact_no: Yup.string()
      .required('Parents contact number is required')
      .test('parents_contact_no', 'Invalid contact number', (value) => {
        if (value === null || value === undefined) {
          return true;
        }
        return /^\d{10}$/.test(value) && value.length >= 10 && value.length <= 14;
      }),
    status: Yup.string().required('Status is required'),
    education: Yup.string().required('Education is required'),
    college: Yup.string().required('College is required'),
  });

  const defaultValues = useMemo(
    () => ({
      student_id: data?.id || '',
      first_name: data?.first_name || '',
      last_name: data?.last_name || '',
      email: data?.email || '',
      country_code: data?.country_code || '',
      phone_no: data?.phone_no || '',
      birth_date: data?.birth_date ? dayjs(data?.birth_date) : null,
      education: data?.education || '',
      college: data?.college || '',
      parents_contact_no: data?.parents_contact_no || '',
      status: !isEdit ? selectedStatus : data?.status || '',
    }),
    [data, isEdit, selectedStatus]
  );

  const handleChange = (e, name, state) => {
    state(e.target.value);
    setValue(name, e.target.value);
  };

  const methods = useForm({
    resolver: yupResolver(StudentSchema),
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
      if (data.country_code && data.phone_no) {
        setPhoneNo(`+${data.country_code} ${data.phone_no}`);
      }
      if (data.parents_contact_no) {
        setParentsContactNo(data.parents_contact_no);
      }
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, data, defaultValues, reset]);

  const onSubmit = async () => {
    try {
      if (values.birth_date && dayjs(values.birth_date).isAfter(dayjs(), 'day')) {
        enqueueSnackbar("Cannot select a future date for birth date", { variant: 'error' });
        return;
      }
      if (isEdit) {
        await updateStudentApi(values)
          .then((res) => {
            enqueueSnackbar(res?.data?.message);
            formClear();
            navigate('/admin/students');
          })
          .catch((err) => {
            console.error(err);
            enqueueSnackbar(err?.response?.data?.message, { variant: 'error' });
          });
      } else {
        await createStudentApi(values)
          .then((res) => {
            enqueueSnackbar(res?.data?.message, { variant: 'success' });
            formClear();
            navigate('/admin/students');
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

  const handlePhoneInput = (e, name, setFunc) => {
    const parsePhoneNumberValue = parsePhoneNumber(e || '');
    const countryCode = parsePhoneNumberValue?.countryCallingCode || null;
    const phoneNumber = parsePhoneNumberValue?.nationalNumber || null;
    setValue(name, phoneNumber);
    setValue(`country_code`, countryCode);
    setFunc(`+${countryCode} ${phoneNumber}`);
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
                <RHFTextField name="first_name" label="First Name" required />
                <RHFTextField name="last_name" label="Last Name" required />
                <RHFTextField name="email" label="Email" required />
                <RHFTextField name="education" label="Education" required />
                <RHFTextField name="college" label="College" required />
                <div>
                  <PhoneInput
                    onChange={(e) => handlePhoneInput(e, 'phone_no', setPhoneNo)}
                    placeholder="Enter phone number with (+91)"
                    defaultCountry="IN"
                    value={phoneNo}
                  />
                  {errors.phone_no && (
                    <FormHelperText error>{errors.phone_no?.message} </FormHelperText>
                  )}
                </div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <StyledDatePicker
                    label="Date of Birth"
                    name="birth_date"
                    value={values?.birth_date}
                    onChange={(e) => setValue('birth_date', e)}
                    format="YYYY-MM-DD"
                    slotProps={{
                      textField: {
                        helperText: errors.birth_date ? errors.birth_date.message : null,
                        error: Boolean(errors.birth_date),
                        required: true,
                      },
                    }}
                  />
                </LocalizationProvider>
                <div>
                  <PhoneInput
                    onChange={(e) => handlePhoneInput(e, 'parents_contact_no', setParentsContactNo)}
                    placeholder="Enter parents contact number with (+91)"
                    defaultCountry="IN"
                    value={parentsContactNo}
                  />
                  {errors.parents_contact_no && (
                    <FormHelperText error>{errors.parents_contact_no?.message} </FormHelperText>
                  )}
                </div>
                <RHFSelect
                  name="status"
                  label="Status"
                  placeholder="Status"
                  value={selectedStatus}
                  onChange={(e) => handleChange(e, 'status', setSelectedStatus)}
                  required
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
              cancelButton="/admin/students"
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
