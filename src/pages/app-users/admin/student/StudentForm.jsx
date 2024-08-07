import dayjs from 'dayjs';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import PhoneInput, { parsePhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

// @mui
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Card, Grid, styled, Button, TextField, Typography, FormHelperText } from '@mui/material';

// components
import '../../../../assets/css/PhoneInput.css';
import CourseSelect from 'src/components/select/CourseSelect'; // Import CourseSelect component

import { FormBox, FormBottomButton } from '../../../../sections/@dashboard/user/form';
import {
  RHFSelect,
  RHFTextField,
  FormProvider,
  RHFUploadVideo,
} from '../../../../components/hook-form';
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
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [phoneNo, setPhoneNo] = useState('');
  const [parentsContactNo, setParentsContactNo] = useState('');

  const { enqueueSnackbar } = useSnackbar();
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [fileName, setFileName] = useState(null);

  const StudentSchema = Yup.object().shape({
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
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
    email: Yup.string().email('Invalid email').required('Email is required'),
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
    status: Yup.string().required('Status is required'),
    education: Yup.string().required('Education is required'),
    college: Yup.string().required('College is required'),
    course_id: Yup.string().required('Course is required'), // Add course_id validation
    profile_image: Yup.mixed().nullable(),
  });

  const defaultValues = useMemo(
    () => ({
      student_id: data?.id || '',
      first_name: data?.first_name || '',
      last_name: data?.last_name || '',
      country_code: data?.country_code || '',
      phone_no: data?.phone_no || '',
      parents_contact_no: data?.parents_contact_no || '',
      email: data?.email || '',
      birth_date: data?.birth_date ? dayjs(data?.birth_date) : null,
      education: data?.education || '',
      college: data?.college || '',
      address: data?.address || '',
      status: !isEdit ? selectedStatus : data?.status || '',
      course_id: data?.course_id || '', // Initialize course_id from data if available
      profile_image: data?.profile_image || null,
      admission_date: data?.admission_date ? dayjs(data?.admission_date) : null,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, isEdit]
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

  useEffect(
    () => {
      if (isEdit && data) {
        reset(defaultValues);
        if (data.status !== undefined && data.status !== null) {
          setSelectedStatus(data.status);
        }
        setSelectedCourse({
          value: data?.Course?.id,
          label: data?.Course?.course_name,
          
        });
        if (data.country_code && data.phone_no) {
          setPhoneNo(`+${data.country_code} ${data.phone_no}`);
        }
        if (data.parents_contact_no) {
          setParentsContactNo(`+${data.country_code} ${data.parents_contact_no}`);
        }
        if (data.profile_image) {
          setProfileImagePreview(data.profile_image);
        }
      }
      if (!isEdit) {
        reset(defaultValues);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isEdit, data]
  );

  const onSubmit = async (formValues) => {
    try {
      const formData = new FormData();
      Object.entries(formValues).forEach(([key, value]) => {
        if (key === 'profile_image' && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value);
        }
      });

      if (isEdit) {
        await updateStudentApi(formData)
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
        await createStudentApi(formData)
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

  const handleCourseChanges = (course) => {
    console.log('Selected course:', course);
    setSelectedCourse({
      value: course.value,
      label: course.label,
      
    });
    setValue('course_id', course.value);
    
  };

  const handleFileSelect = (event) => {
    setValue('file', event.target.files[0]);
    setFileName(event.target.files[0].name);
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
                <div>
                  <PhoneInput
                    placeholder="Phone Number"
                    value={phoneNo}
                    defaultCountry="IN"
                    onChange={(e) => {
                      handlePhoneInput(e, 'phone_no', setPhoneNo);
                    }}
                    error={!!errors.phone_no}
                    required
                  />
                  <FormHelperText error>{errors.phone_no?.message}</FormHelperText>
                </div>
                <div>
                  <PhoneInput
                    placeholder="Parents Contact Number"
                    value={parentsContactNo}
                    defaultCountry="IN"
                    onChange={(e) => {
                      handlePhoneInput(e, 'parents_contact_no', setParentsContactNo);
                    }}
                    error={!!errors.parents_contact_no}
                    required
                  />
                  <FormHelperText error>{errors.parents_contact_no?.message}</FormHelperText>
                </div>
                <RHFTextField name="email" label="Email Address" required />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <StyledDatePicker
                    label="Admission Date"
                    value={values.admission_date}
                    onChange={(date) => {
                      setValue('admission_date', date);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={!!errors.admission_date}
                        helperText={errors.admission_date?.message}
                      />
                    )}
                    required
                  />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <StyledDatePicker
                    label="Date of Birth"
                    value={values.birth_date}
                    onChange={(date) => {
                      setValue('birth_date', date);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={!!errors.birth_date}
                        helperText={errors.birth_date?.message}
                      />
                    )}
                    required
                  />
                </LocalizationProvider>
                <RHFTextField name="education" label="Education" required />
                <RHFTextField name="college" label="College" required />
                <RHFTextField name="address" label="Address" required />
                <CourseSelect
                  name="course_id"
                  label="Course"
                  onChange={(course) => handleCourseChanges(course)}
                  value={selectedCourse}
                  isError={!!errors.course_id}
                  errorText={errors.course_id?.message}
                  isRequired
                />
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
                <RHFUploadVideo
                  sx={{ width: { xs: '50%', sm: '100%' } }}
                  type="button"
                  variant="outlined"
                  component="label"
                  error={errors.file}
                  required
                >
                  <Button
                    variant="contained"
                    component="label"
                    type="button"
                    style={{ width: '150px' }}
                  >
                    {values?.file ? 'Change' : 'Upload'}
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileSelect(e)}
                    />
                  </Button>
                  <span>{fileName === null ? '' : fileName}</span>
                </RHFUploadVideo>
                {errors?.file && (
                  <FormHelperText error sx={{ px: 2 }}>
                    {errors?.file?.message}
                  </FormHelperText>
                )}
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
