// import dayjs from 'dayjs';
// import * as Yup from 'yup';
// import PropTypes from 'prop-types';
// import { useSnackbar } from 'notistack';
// // form
// import { watch, useForm} from 'react-hook-form';
// import { useNavigate } from 'react-router-dom';
// import { useMemo, useState, useEffect } from 'react';
// import { yupResolver } from '@hookform/resolvers/yup';
// import { Grid, Card, styled, Typography, FormHelperText } from '@mui/material';

// import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// // components
// import DesignationSelect from 'src/components/select/DesignationSelect';
// import { FormBox, FormBottomButton } from '../../../../sections/@dashboard/user/form';
// import { RHFSelect, FormProvider, RHFTextField } from '../../../../components/hook-form';
// import { createNoticeApi, updateNoticeApi} from '../../../../apis/admin/notice/NoticeApis';

// import { SELECT_NOTICE_STATUS, SELECT_NOTICE_VISIBILITY } from '../../../../data/constants';

// // ----------------------------------------------------------------------

// NoticeForm.propTypes = {
//   isEdit: PropTypes.bool,
//   data: PropTypes.object,
// };

// const StyledDatePicker = styled(DatePicker)(() => ({
//   '& .MuiInputLabel-asterisk': {
//     color: 'red',
//   },
// }));

// export default function NoticeForm({ isEdit, data }) {
//   const navigate = useNavigate();
//   const [selectedVisibility, setSelectedVisibility] = useState('Public');
//   const [selectedPriority, setSelectedPriority] = useState(0);

//   const { enqueueSnackbar } = useSnackbar();

//   const NoticeSchema = Yup.object().shape({
//     title: Yup.string().required('Title is required'),
//     content: Yup.string().required('Content is required'),
//   });

//   const defaultValues = useMemo(
//     () => ({
//       id: data?.id || '',
//       title: data?.title || '',
//       content: data?.content || '',
//       posted_by: data?.posted_by || '',
//       date_posted: data?.date_posted ? dayjs(data?.date_posted) : null,
//       expiration_date: data?.expiration_date ? dayjs(data?.expiration_date) : null,
//       category: data?.category || '',
//       tags: data?.tags || '',
//       visibility: !isEdit ? selectedVisibility : data?.visibility || '',
//       attachments: data?.attachments || [],
//       status: !isEdit ? 'Draft' : data?.status || '',
//       priority: !isEdit ? selectedPriority : data?.priority || 0,
//     }),
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     [data]
//   );

//   const handleChange = (e, name, state) => {
//     state(e.target.value);
//     setValue(name, e.target.value);
//   };

//   const methods = useForm({
//     resolver: yupResolver(NoticeSchema),
//     defaultValues,
//   });

//   const {
//     reset,
//     handleSubmit,
//     setValue,
//     formState: { isSubmitting, errors },
//   } = methods;

//   const values = watch();

//   useEffect(() => {
//     if (isEdit && data) {
//       reset(defaultValues);
//     }
//     if (!isEdit) {
//       reset(defaultValues);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isEdit, data]);

//   const onSubmit = async () => {
//     try {
//       if (isEdit) {
//         await updateNoticeApi(values)
//           .then((res) => {
//             enqueueSnackbar(res?.data?.message);
//             formClear();
//             navigate('/admin/notices');
//           })
//           .catch((err) => {
//             console.error(err);
//             enqueueSnackbar(err?.response?.data?.message, { variant: 'error' });
//           });
//       } else {
//         await createNoticeApi(values)
//           .then((res) => {
//             enqueueSnackbar(res?.data?.message, { variant: 'success' });
//             formClear();
//             navigate('/admin/notices');
//           })
//           .catch((err) => {
//             console.error(err);
//             enqueueSnackbar(err?.response?.data?.message, { variant: 'error' });
//           });
//       }
//     } catch (error) {
//       console.error(error);
//       enqueueSnackbar(error?.response?.data?.message, { variant: 'error' });
//     }
//   };

//   const formClear = () => {
//     reset(defaultValues);
//     setSelectedVisibility('Public');
//     setSelectedPriority(0);
//   };

//   return (
//     <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
//       <Grid container spacing={3}>
//         <Grid item xs={12} md={12}>
//           <Card sx={{ p: 3 }}>
//             <Typography sx={{ p: 2 }} color="#FF4842" fontSize={13}>
//               All fields marked with * are mandatory
//             </Typography>
//             <form noValidate>
//               <FormBox>
//                 <RHFTextField name="title" label="Title" required />
//                 <RHFTextField name="content" label="Content" required multiline />
//                 <RHFTextField name="posted_by" label="Posted By" />
//                 <RHFTextField
//                   name="date_posted"
//                   label="Date Posted"
//                   type="date"
//                   InputLabelProps={{ shrink: true }}
//                 />
//                 <RHFTextField
//                   name="expiration_date"
//                   label="Expiration Date"
//                   type="date"
//                   InputLabelProps={{ shrink: true }}
//                 />
//                 <RHFTextField name="category" label="Category" />
//                 <RHFTextField name="tags" label="Tags" />
//                 <RHFSelect
//                   name="visibility"
//                   label="Visibility"
//                   placeholder="Visibility"
//                   value={selectedVisibility}
//                   onChange={(e) => handleChange(e, 'visibility', setSelectedVisibility)}
//                 >
//                   {Object.entries(SELECT_NOTICE_VISIBILITY).map(([key, value]) => (
//                     <option key={key} value={value}>
//                       {key}
//                     </option>
//                   ))}
//                 </RHFSelect>
//                 <RHFTextField
//                   name="priority"
//                   label="Priority"
//                   type="number"
//                   InputProps={{ inputProps: { min: 0 } }}
//                 />
//               </FormBox>
//             </form>

//             <FormBottomButton
//               cancelButton="/admin/notices"
//               onClear={() => formClear()}
//               isSubmitting={isSubmitting}
//               isEdit={isEdit}
//             />
//           </Card>
//         </Grid>
//       </Grid>
//     </FormProvider>
//   );
// }
import React from 'react'

export default function NoticeForm() {
  return (
    <div>NoticeForm</div>
  )
}
