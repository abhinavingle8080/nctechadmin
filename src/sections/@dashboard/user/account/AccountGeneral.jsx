import * as Yup from 'yup';

import { useSnackbar } from 'notistack';
import { useState, useCallback } from 'react';
// form
import { useForm } from 'react-hook-form';
import 'react-phone-number-input/style.css';
import { yupResolver } from '@hookform/resolvers/yup';
import PhoneInput, { parsePhoneNumber } from 'react-phone-number-input';

// @mui
import { Box, Grid, Card, Stack, Typography, FormHelperText } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useAuth from '../../../../hooks/useAuth';
// utils
import { fData } from '../../../../utils/formatNumber';

// components
import '../../../../assets/css/PhoneInput.css';
import { FormProvider, RHFTextField, RHFUploadAvatar } from '../../../../components/hook-form';
import { updateProfileApi } from '../../../../apis/admin/profile/ProfileApis';

// ----------------------------------------------------------------------

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();
  const [phoneNo, setPhoneNo] = useState('');

  const { user } = useAuth();

  const UpdateUserSchema = Yup.object().shape({
    first_name: Yup.string().required('Name is required'),
    last_name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    phone_no: Yup.string().nullable().matches(/^\d{10}$/, 'Phone number must be 10 digits').transform((value, originalValue) =>
    originalValue === '' ? null : value
  ),
});    


  const defaultValues = {
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    profile_image: user?.profile_image || '',
    country_code: user?.country_code || '',
    phone_no: user?.phone_no || '',
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },

  } = methods;

  const onSubmit = async () => {
    try {
      const data = new FormData();

      data.append('first_name', methods.getValues('first_name'));
      data.append('last_name', methods.getValues('last_name'));
      data.append('email', methods.getValues('email'));
      data.append('country_code', methods.getValues('country_code'));
      data.append('phone_no', methods.getValues('phone_no'));
      data.append('profile_image', methods.getValues('profile_image'));

      const response = await updateProfileApi(data);

      if (response.status === 200) {
        enqueueSnackbar('Profile updated successfully', { variant: 'success' });
      }else{
        enqueueSnackbar('Profile updated failed', { variant: 'error' });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'profile_image',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

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
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              name="profile_image"
              accept="image/*"
              maxSize={3145728}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 2,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.secondary',
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {fData(3145728)}
                </Typography>
              }
            />

            {/* <RHFSwitch name="isPublic" labelPlacement="start" label="Public Profile" sx={{ mt: 5 }} /> */}
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 2,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="first_name" label="First Name" />
              <RHFTextField name="last_name" label="Last Name" />

              <RHFTextField name="email" label="Email Address" />
              <RHFTextField name="country_code" label="Country Phone Code" />
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
                </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
