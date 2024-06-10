import React, { useMemo, useState, useEffect } from 'react';
import dayjs from 'dayjs';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, Card, styled, Typography } from '@mui/material';
import { MuiFileInput } from 'mui-file-input';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// components
import { LocalizationProvider } from '@mui/x-date-pickers';
import { FormBox, FormBottomButton } from '../../../../sections/@dashboard/user/form';
import { RHFSelect, FormProvider, RHFTextField } from '../../../../components/hook-form';
import { createNoticeApi, updateNoticeApi } from '../../../../apis/admin/notice/NoticeApis';
import {
  SELECT_NOTICE_STATUS,
  SELECT_NOTICE_CATEGORY,
  SELECT_NOTICE_VISIBILITY,
} from '../../../../data/constants';

NoticeForm.propTypes = {
  isEdit: PropTypes.bool,
  data: PropTypes.object,
};

const StyledDatePicker = styled(DatePicker)(() => ({
  '& .MuiInputLabel-asterisk': {
    color: 'red',
  },
}));

export default function NoticeForm({ isEdit, data }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [ selectedFile, setSelectedFile ] = useState(null);

  const NoticeSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    content: Yup.string().required('Content is required'),
    date_posted: Yup.string().required('Date is required'),
    expiration_date: Yup.string().required('Expiration date is required'),
  });

  const defaultValues = useMemo(
    () => ({
      id: data?.id || '',
      title: data?.title || '',
      content: data?.content || '',
      date_posted: data?.date_posted ? dayjs(data?.date_posted) : null,
      expiration_date: data?.expiration_date ? dayjs(data?.expiration_date) : null,
      category: !isEdit ? 'Notice' : data?.category || 'Notice',
      tags: data?.tags || '',
      visibility: !isEdit ? 'Public' : data?.visibility || '',
      status: !isEdit ? 'Active' : data?.status || '',
      priority: !isEdit ? 0 : data?.priority || 0,
      attachment: data?.attachment || '',
    }),
    [data, isEdit]
  );

  const methods = useForm({
    resolver: yupResolver(NoticeSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = methods;

  const values = watch();

  useEffect(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);

  const onSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('notice_id', values.id);
      formData.append('title', values.title);
      formData.append('content', values.content);
      formData.append('date_posted', values.date_posted);
      formData.append('expiration_date', values.expiration_date);
      formData.append('category', values.category);
      formData.append('tags', values.tags);
      formData.append('visibility', values.visibility);
      formData.append('status', values.status);
      formData.append('priority', values.priority);
      formData.append('attachment', selectedFile);
      // Append attachments here

      const apiCall = isEdit ? updateNoticeApi : createNoticeApi;
      await apiCall(formData)
        .then((res) => {
          enqueueSnackbar(res?.data?.message, { variant: 'success' });
          formClear();
          navigate('/admin/notices');
        })
        .catch((err) => {
          console.error(err);
          enqueueSnackbar(err?.response?.data?.message, { variant: 'error' });
        });
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error?.response?.data?.message, { variant: 'error' });
    }
  };

  const formClear = () => {
    reset(defaultValues);
  };

  const handleDrop = (e) => {
    setSelectedFile(e)
  }

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
                <RHFSelect name="category" label="Category" placeholder="Category">
                  {Object.entries(SELECT_NOTICE_CATEGORY).map(([key, value]) => (
                    <option key={key} value={value}>
                      {key}
                    </option>
                  ))}
                </RHFSelect>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <StyledDatePicker
                    label="Date Posted"
                    name="date_posted"
                    value={values?.date_posted}
                    onChange={(e) => {
                      const selectedDate = e;
                      const currentDate = dayjs();
                      if (selectedDate.isBefore(currentDate, 'day')) {
                        // Do not update if selected date is before current date
                        return;
                      }
                      setValue('date_posted', selectedDate);
                    }}
                    format="YYYY-MM-DD"
                    minDate={dayjs()}
                    slotProps={{
                      textField: {
                        helperText: errors.date_posted ? errors.date_posted.message : null,
                        error: Boolean(errors.date_posted),
                        required: true,
                      },
                    }}
                  />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <StyledDatePicker
                    label="Expiration Date"
                    name="expiration_date"
                    value={values?.expiration_date}
                    // minDate={values?.date_posted} // Set minDate to the selected "date_posted"
                    onChange={(e) => {
                      const selectedDate = e;
                      const currentDatePosted = values?.date_posted;
                      if (!currentDatePosted) {
                        // If no date posted is selected, don't update expiration date
                        return;
                      }
                      if (selectedDate.isBefore(currentDatePosted, 'day')) {
                        // If selected expiration date is before date posted, show error
                        enqueueSnackbar('Expiration date cannot be earlier than the date posted', {
                          variant: 'error',
                        });
                        return;
                      }
                      setValue('expiration_date', selectedDate);
                    }}
                    format="YYYY-MM-DD"
                    minDate={dayjs()}
                    slotProps={{
                      textField: {
                        helperText: errors.expiration_date ? errors.expiration_date.message : null,
                        error: Boolean(errors.expiration_date),
                        required: true,
                      },
                    }}
                  />
                </LocalizationProvider>

                <RHFTextField name="tags" label="Tags" />
                <RHFSelect name="visibility" label="Visibility" placeholder="Visibility">
                  {Object.entries(SELECT_NOTICE_VISIBILITY).map(([key, value]) => (
                    <option key={key} value={value}>
                      {key}
                    </option>
                  ))}
                </RHFSelect>
                <RHFSelect name="status" label="Status" placeholder="Status">
                  {Object.entries(SELECT_NOTICE_STATUS).map(([key, value]) => (
                    <option key={key} value={value}>
                      {key}
                    </option>
                  ))}
                </RHFSelect>
                <RHFTextField
                  name="priority"
                  label="Priority"
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                />
                <MuiFileInput
                  label="Attachments"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                  name="attachment"
                  onChange={(e) => {
                    handleDrop(e);
                  }}
                  value={selectedFile}
                />
              </FormBox>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12} mt={3}>
                  <RHFTextField name="content" label="Content" required multiline rows={3} />
                </Grid>
              </Grid>
            </form>
            <FormBottomButton
              cancelButton="/admin/notices"
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
