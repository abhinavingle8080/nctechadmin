import dayjs from 'dayjs';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import PhoneInput, { parsePhoneNumber } from 'react-phone-number-input';
import { useMemo,useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// @mui
import { Card, Grid, Typography, FormHelperText } from '@mui/material';

// components
import { FormBox, FormBottomButton } from '../../../../sections/@dashboard/user/form';
import { RHFSelect, FormProvider, RHFTextField } from '../../../../components/hook-form';
import { createDesignationApi, updateDesignationApi } from '../../../../apis/admin/designation/DesignationApis';
import { SELECT_STATUS } from '../../../../data/constants';

// ----------------------------------------------------------------------

EmployeeForm.propTypes = {
  isEdit: PropTypes.bool,
  data: PropTypes.object,
};

export default function EmployeeForm({ isEdit, data }) {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState('Active');

  const { enqueueSnackbar } = useSnackbar();

  const RoleSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
  });

  const defaultValues = useMemo(
    () => ({
      designation_id: data?.id || '',
      title: data?.title || '',
      status: !isEdit ? selectedStatus : data?.status || '',
    }),
    [data, isEdit, selectedStatus]
  );

  const methods = useForm({
    resolver: yupResolver(RoleSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = methods;

  useEffect(() => {
    if (isEdit && data) {
      reset(defaultValues);
      if (data.status !== undefined && data.status !== null) {
        setSelectedStatus(data.status);
      }
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, data]);

  const onSubmit = async (formData) => {
    try {
      if (isEdit) {
        await updateDesignationApi(formData)
          .then((res) => {
            enqueueSnackbar(res?.data?.message, { variant: 'success' });
            formClear();
            navigate('/admin/designations');
          })
          .catch((err) => {
            console.error(err);
            enqueueSnackbar(err?.response?.data?.message, { variant: 'error' });
          });
      } else {
        await createDesignationApi(formData)
          .then((res) => {
            enqueueSnackbar(res?.data?.message, { variant: 'success' });
            formClear();
            navigate('/admin/designations');
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
  
  const handleChange = (e, name, state) => {
    state(e.target.value);
    setValue(name, e.target.value);
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
                <RHFTextField name="title" label="Title" required />

                <RHFSelect
                  name="status"
                  label="Status"
                  placeholder="Status"
                  value={selectedStatus}
                  onChange={(e) => handleChange(e, 'status',  setSelectedStatus)}
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
              cancelButton="/admin/designations"
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
