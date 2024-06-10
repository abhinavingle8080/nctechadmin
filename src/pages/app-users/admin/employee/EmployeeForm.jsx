import dayjs from 'dayjs';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
// form
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
import { createEmployeeApi, updateEmployeeApi } from '../../../../apis/admin/employee/EmployeeApis';
import { SELECT_STATUS, SELECT_GENDER, SELECT_EMPLOYMENT_STATUS } from '../../../../data/constants';

// ----------------------------------------------------------------------

EmployeeForm.propTypes = {
  isEdit: PropTypes.bool,
  data: PropTypes.object,
};

const StyledDatePicker = styled(DatePicker)(() => ({
  '& .MuiInputLabel-asterisk': {
    color: 'red',
  },
}));

export default function EmployeeForm({ isEdit, data }) {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState('Active');
  const [selectedEmploymentStatus, setSelectedEmploymentStatus] = useState('Permanent');
  const [selectedGender, setSelectedGender] = useState('Male');
  const [phoneNo, setPhoneNo] = useState('');

  const { enqueueSnackbar } = useSnackbar();

  const RoleSchema = Yup.object().shape({
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    email: Yup.string()
      .email('Invalid email')
      .matches(/\.com$/, 'Email must end with .com')
      .required('Email is required'), date_of_birth: Yup.string()
      .required('Date of birth is required')
      .test('is-adult', 'Employee must be 18 years or older', (value) => {
        if (!value) return false; // If date is not provided, fail validation
        const birthDate = dayjs(value);
        const today = dayjs();
        const age = today.diff(birthDate, 'years');
        return age >= 18; // Validate if age is 18 or older
      }),
    emp_start_date: Yup.string().required('Employment start date is required'),
    designation_id: Yup.string().required('Designation is required'),
    // address: Yup.string().required('Address is required'),
    phone_no: Yup.string()
    .nullable()
    .test('phone_no', 'Invalid phone number', value => {
        if (value === null || value === undefined) {
            return true; // Accept null or undefined values
        } 
        // eslint-disable-next-line no-else-return
        else {
            return (
                /^\d{10}$/.test(value) &&
                value.length >= 10 &&
                value.length <= 14
            );
        }
    })
  });

  const defaultValues = useMemo(
    () => ({
      employee_id: data?.id || '',
      first_name: data?.first_name || '',
      last_name: data?.last_name || '',
      email: data?.email || '',
      country_code: data?.country_code || '',
      phone_no: data?.phone_no || '',
      gender: !isEdit ? selectedGender : data?.gender || 'Male',
      date_of_birth: data?.date_of_birth ? dayjs(data?.date_of_birth) : null,
      employment_status: !isEdit ? selectedEmploymentStatus : data?.employment_status || '',
      emp_start_date: data?.emp_start_date ? dayjs(data?.emp_start_date) : null,
      emp_end_date: data?.emp_end_date ? dayjs(data?.emp_end_date) : null,
      address: data?.address || '',
      status: !isEdit ? selectedStatus : data?.status || '',
      designation_id: data?.designation_id || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
  );

  const handleChange = (e, name, state) => {
    state(e.target.value);
    setValue(name, e.target.value);
  };

  const methods = useForm({
    resolver: yupResolver(RoleSchema),
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
      if(data.country_code && data.phone_no){
        setPhoneNo(`+${data.country_code} ${data.phone_no}`);
      }
      setSelectedGender(data.gender);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, data]);

  const onSubmit = async () => {
    try {
      if (values.date && dayjs(values.date).isBefore(dayjs(), 'day')) {
        enqueueSnackbar("Cannot select a past date", { variant: 'error' });
        return; // Prevent submission
      }
      if (isEdit) {
        await updateEmployeeApi(values)
          .then((res) => {
            enqueueSnackbar(res?.data?.message);
            formClear();
            navigate('/admin/employees');
          })
          .catch((err) => {
            console.error(err);
            enqueueSnackbar(err?.response?.data?.message, { variant: 'error' });
          });
      } else {
        await createEmployeeApi(values)
          .then((res) => {
            enqueueSnackbar(res?.data?.message, { variant: 'success' });
            formClear();
            navigate('/admin/employees');
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
      setSelectedEmploymentStatus(data?.employment_status);
      setSelectedGender(data?.gender);
    } else {
      reset();
      setSelectedStatus('Active');
      setSelectedEmploymentStatus('Permanent');
      setSelectedGender('Male');
    }
  };

  const handlePhoneInput = (e) => {

    const parsePhoneNumberValue = parsePhoneNumber(e || '');
    const countryCode = parsePhoneNumberValue?.countryCallingCode || null;
    const phoneNumber = parsePhoneNumberValue?.nationalNumber || null;
    setValue('country_code', countryCode);
    setValue('phone_no', phoneNumber);
    setPhoneNo(`+${countryCode} ${phoneNumber}`);
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
                <DesignationSelect
                  name="designation_id"
                  label="Designation"
                  onChange={(e) => setValue('designation_id', e.target.value)}
                  value={values.designation_id}
                  isError={!!errors.designation_id}
                  errorText={errors.designation_id?.message}
                  isRequired
                />
                <div>
                  <PhoneInput
                    onChange={(e)=>handlePhoneInput(e)}
                    placeholder="Enter phone number with (+91)"
                    defaultCountry="IN"
                    value={phoneNo}
                  />
                  {errors.phone_no && (
                    <FormHelperText error>{errors.phone_no?.message} </FormHelperText>
                  )}
                </div>
                <RHFSelect
                  name="gender"
                  label="Gender"
                  placeholder="Gender"
                  value={selectedGender}
                  onChange={(e) => handleChange(e, 'gender', setSelectedGender)}
                  required
                >
                  {Object.entries(SELECT_GENDER).map(([key, value]) => (
                    <option key={key} value={value}>
                      {key}
                    </option>
                  ))}
                </RHFSelect>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <StyledDatePicker
                    label="Date of Birth"
                    name="date_of_birth"
                    value={values?.date_of_birth}
                    onChange={(e) => {
                      setValue('date_of_birth', e);
                    }}
                    format="YYYY-MM-DD"
                    // minDate={dayjs().add(1, 'day')}
                    slotProps={{
                      textField: {
                        helperText: errors.date_of_birth ? errors.date_of_birth.message : null,
                        error: Boolean(errors.date_of_birth),
                        required: true,
                      },
                    }}
                  />
                </LocalizationProvider>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <StyledDatePicker
                    label="Employment Start Date"
                    name="emp_start_date"
                    value={values?.emp_start_date}
                    onChange={(e) => {
                      setValue('emp_start_date', e);
                    }}
                    format="YYYY-MM-DD"
                    // minDate={dayjs().add(1, 'day')}
                    slotProps={{
                      textField: {
                        helperText: errors.emp_start_date ? errors.emp_start_date.message : null,
                        error: Boolean(errors.emp_start_date),
                        required: true,
                      },
                    }}
                  />
                </LocalizationProvider>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <StyledDatePicker
                    label="Employment End Date"
                    name="emp_end_date"
                    value={values?.emp_end_date}
                    onChange={(e) => {
                      setValue('emp_end_date', e);
                    }}
                    format="YYYY-MM-DD"
                    // minDate={dayjs().add(1, 'day')}
                    slotProps={{
                      textField: {
                        helperText: errors.emp_end_date ? errors.emp_end_date.message : null,
                        error: Boolean(errors.emp_end_date),
                        // required: true,
                        disabled: !isEdit,
                      },
                    }}
                  />
                </LocalizationProvider>

                <RHFSelect
                  name="employment_status"
                  label="Employment Type"
                  placeholder="Employment Status"
                  value={selectedEmploymentStatus}
                  onChange={(e) =>
                    handleChange(e, 'employment_status', setSelectedEmploymentStatus)
                  }
                >
                  {Object.entries(SELECT_EMPLOYMENT_STATUS).map(([key, value]) => (
                    <option key={key} value={value}>
                      {key}
                    </option>
                  ))}
                </RHFSelect>
             

                <RHFTextField
                  name="address"
                  label="Address"
                  multiline
                  rows={3}
                  placeholder="Address"
                />

                <RHFSelect
                  name="status"
                  label="Status"
                  placeholder="Status"
                  value={selectedStatus}
                  onChange={(e) => handleChange(e, 'status', setSelectedStatus)}
                >
                  {Object.entries(SELECT_STATUS).map(([key, value]) => (
                    <option key={key} value={value}>
                      {key}
                    </option>
                  ))}
                </RHFSelect>
                {/* <RHFTextField
                  multiline
                  rows={3} // Specify the number of rows for multiline input
                  name="address"
                  label="Address"
                  // inputRef={register} // Register the input field
                  // required
                />
                {errors.address && (
                  <FormHelperText error>{errors.address?.message} </FormHelperText>
                )} */}
              </FormBox>
            </form>

            <FormBottomButton
              cancelButton="/admin/employees"
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
