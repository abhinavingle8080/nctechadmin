import { useMemo, useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom'; // Combine imports
import { Card, Grid, Container, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { FormBox, FormBottomButton } from '../../../../sections/@dashboard/user/form';
import { RHFSelect, RHFTextField } from '../../../../components/hook-form';
import { createTeamApi, updateTeamApi } from '../../../../apis/admin/team/TeamApis';
import { SELECT_STATUS } from '../../../../data/constants'

TeamForm.propTypes = {
  isEdit: PropTypes.bool,
  data: PropTypes.object,
};

export default function TeamForm({ isEdit, data }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // const { pathname } = useLocation();
  // const { id = '' } = useParams();

  const [selectedStatus, setSelectedStatus] = useState('Active');

  const TeamSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    type: Yup.string().required('Type is required'),
  });

  const defaultValues = useMemo(
  () => ({
    id: data?.id || '',
    name: data?.name || '',
    description: data?.description || '',
    type: data?.type || '',
    status: !isEdit ? selectedStatus : data?.status || '',
}),
  [data, isEdit , selectedStatus]
);

  const methods = useForm({
    resolver: yupResolver(TeamSchema),
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
      setSelectedStatus(data.status || 'Active');
    } else {
      reset(defaultValues);
      setSelectedStatus('Active');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, data, reset, defaultValues]);

  const onSubmit = async (formData) => {
    try {
      if (isEdit) {
        await updateTeamApi(formData)
          .then((res) => {
            enqueueSnackbar(res?.data?.message, { variant: 'success' });
            navigate('/admin/teams');
          })
          .catch((err) => {
            console.error(err);
            enqueueSnackbar(err?.response?.data?.message, { variant: 'error' });
          });
      } else {
        await createTeamApi(formData)
          .then((res) => {
            enqueueSnackbar(res?.data?.message, { variant: 'success' });
            navigate('/admin/teams');
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

  const handleClear = () => {
    reset(defaultValues);
    setSelectedStatus('Active');
  };

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Typography sx={{ p: 2 }} color="#FF4842" fontSize={13}>
              All fields marked with * are mandatory
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormBox>
                <RHFTextField name="name" label="Name" required />
                <RHFTextField name="description" label="Description" required />
                <RHFTextField name="type" label="Type" required />

                {/* <RHFSelect
                  name="status"
                  label="Status"
                  placeholder="Status"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  {Object.entries(SELECT_STATUS).map(([key, value]) => (
                    <option key={key} value={value}>
                      {key}
                    </option>
                  ))}
                </RHFSelect> */}
              </FormBox>
              <FormBottomButton
                cancelButton="/admin/teams"
                onClear={handleClear}
                isSubmitting={isSubmitting}
                isEdit={isEdit}
              />
            </form>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
