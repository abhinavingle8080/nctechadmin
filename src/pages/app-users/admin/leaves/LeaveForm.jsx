import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Grid,
  Table,
  Radio,
  Stack,
  Select,
  styled,
  MenuItem,
  TableRow,
  TableBody,
  TableCell,
  RadioGroup,
  Typography,
  InputLabel,
  FormControl,
  TableContainer,
  FormControlLabel,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import moment from 'moment';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { FormBox, FormBottomButton } from '../../../../sections/@dashboard/user/form';
import { RHFSelect, FormProvider, RHFTextField } from '../../../../components/hook-form';
import { createLeaveApi, updateLeaveApi } from '../../../../apis/admin/leave/LeaveApis';
import { getHolidaysNoPaginationApi } from '../../../../apis/admin/holiday/HolidayApis';
import EmployeeSelect from '../../../../components/select/EmployeeSelect';
import { SELECT_USER_STATUS } from '../../../../data/constants';

LeaveForm.propTypes = {
  isEdit: PropTypes.bool,
  data: PropTypes.object,
};

const StyledDatePicker = styled(DatePicker)(() => ({
  '& .MuiInputLabel-asterisk': {
    color: 'red',
  },
}));

export default function LeaveForm({ isEdit, data }) {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState('Pending');
  const [holidays, setHolidays] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [maxDescriptionChar, setMaxDescriptionChar] = useState(200);
  const [descriptionLength, setDescriptionLength] = useState(0);

  const RoleSchema = Yup.object().shape({
    start_date: Yup.date()
    .required('Start date is required')
    .test(
      'is-past-year',
      'Start date cannot be in the past year',
      value => !dayjs(value).isBefore(dayjs().subtract(1, 'year'))
    ),
  end_date: Yup.date()
    .required('End date is required')
    .test(
      'is-past-year',
      'End date cannot be in the past year',
      value => !dayjs(value).isBefore(dayjs().subtract(1, 'year'))
    )
    .min(Yup.ref('start_date'), 'End date cannot be earlier than start date'),
    reason: Yup.string().required('Reason is required'),
    remark: Yup.string().test('required-if-rejected', 'Remark is required when status is rejected', (value, { parent }) => {
      const { status } = parent;
      if (status === 'Rejected') {
        return !!value;
      }
      return true;
    }),
  });

  const defaultValues = useMemo(
    () => ({
      leave_id: data?.id || '',
      employee_id: data?.employee_id ? data?.employee_id : '',
      start_date: data?.start_date ? dayjs(data?.start_date) : null,
      end_date: data?.end_date ? dayjs(data?.end_date) : null,
      reason: data?.reason || '',
      remark: data?.remark || '',
      status: !isEdit ? selectedStatus : data?.status || 'Pending',
      leaveDays: data?.leaveDays || [],
    }),
    [data, isEdit, selectedStatus]
  );

  const getHolidays = () => {
    getHolidaysNoPaginationApi()
      .then((res) => {
        setHolidays(res?.data?.data?.rows);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getHolidays();
  }, []);

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
      reset(defaultValues)
      if (data.status !== undefined && data.status !== null) {
        setSelectedStatus(data.status);
      }
      
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [isEdit, data]);

  const onSubmit = async () => {
    try {
      if (values.start_date) {
        if (dayjs(values.start_date).isBefore(dayjs().startOf('year'))) {
          enqueueSnackbar("Cannot select a past date or year", { variant: 'error', onClose: () => {
            enqueueSnackbar("Please select a date within the current year", { variant: 'error' });
          }});
          return; // Prevent submission
        }
      }
      if (values.end_date) {
        if (dayjs(values.end_date).isBefore(dayjs().startOf('year'))) {
          enqueueSnackbar("Cannot select a past date or year for end date", { variant: 'error', onClose: () => {
            enqueueSnackbar("Please select a date within the current year for end date", { variant: 'error' });
          }});
          return; // Prevent submission
        }
      }
      // const { start_date, end_date } = values;
  
      // Check if start_date is after the current date
      // if (dayjs(start_date).isAfter(dayjs(), 'day')) {
      //   enqueueSnackbar("Start date can't be after the current date", { variant: 'error' });
      //   return;
      // }
  
      // // Check if end_date is not earlier than start_date
      // if (dayjs(end_date).isBefore(dayjs(start_date), 'day')) {
      //   enqueueSnackbar("End date can't be earlier than start date", { variant: 'error' });
      //   return;
      // }
  
      const apiCall = isEdit ? updateLeaveApi : createLeaveApi;
      await apiCall(values)
        .then((res) => {
          enqueueSnackbar(res?.data?.message, { variant: 'success' });
          formClear();
          navigate('/admin/leaves');
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

  const handleDescriptionChange = (event) => {
    const newText = event.target.value;

    if (newText.length <= maxDescriptionChar) {
      setDescriptionLength(event.target.value.length);
      setValue('description', newText);
    }
  };

  useEffect(() => {
    const calculateLeaveDays = async () => {
      if (values.start_date && values.end_date) {
        const daysData = [];
        const currentDate = new Date(values.start_date);
        const end = new Date(values.end_date);

        while (currentDate <= end) {
          const isSunday = currentDate.getDay() === 0;
          const isHoliday = holidays.some((holiday) =>
            moment(holiday.date).isSame(currentDate, 'day')
          );
          daysData.push({
            date: moment(currentDate).format('YYYY-MM-DD'),
            dayName: moment(currentDate).format('dddd'),
            selectedOption: 'FullDay',
            is_holiday: isHoliday || isSunday,
          });
          currentDate.setDate(currentDate.getDate() + 1);
        }

        setValue('leaveDays', daysData);
      }
    };
    calculateLeaveDays();
  }, [values.start_date, values.end_date, setValue, holidays]);

  const getHolidayName = (date) => {
    const holiday = holidays.find((day) => moment(day.date).format('YYYY-MM-DD') === date);
    return holiday ? holiday.name : 'Sunday';
  };

  const handleRadioChange = (index, newValue) => {
    const newLeaveDays = values.leaveDays.map((day, i) => {
      if (i === index) {
        return { ...day, selectedOption: newValue };
      }
      return day;
    });
    setValue('leaveDays', newLeaveDays);
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
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <StyledDatePicker
                    label="Start Date"
                    name="start_date"
                    value={values?.start_date}
                    onChange={(e) => {
                      setValue('start_date', e);
                    }}
                    format="YYYY-MM-DD"
                    minDate={dayjs().startOf('day')} 
                    slotProps={{
                      textField: {
                        helperText: errors.start_date ? errors.start_date.message : null,
                        error: Boolean(errors.start_date),
                        required: true,
                      },
                    }}
                  />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <StyledDatePicker
                    label="End Date"
                    name="end_date"
                    value={values?.end_date}
                    onChange={(e) => {
                      setValue('end_date', e);
                    }}
                    format="YYYY-MM-DD"
                    minDate={dayjs().startOf('day')} 
                    slotProps={{
                      textField: {
                        helperText: errors.end_date ? errors.end_date.message : null,
                        error: Boolean(errors.end_date),
                        required: true,
                      },
                    }}
                  />
                  {!isEdit && (
                    <EmployeeSelect 
                      name="employee_id"
                      label="Employee Name"
                      onChange={(e) => setValue('employee_id', e.target.value)}
                      value={values.employee_id}
                      isError={!!errors.employee_id}
                    />
                  )}
                  {isEdit && (
                    <RHFSelect
                      name="status"
                      label="Status"
                      placeholder="Status"
                      value={selectedStatus}
                      onChange={(e) => handleChange(e, 'status', setSelectedStatus)}
                    >
                      {Object.entries(SELECT_USER_STATUS).map(([key, value]) => (
                        <option key={key} value={value}>
                          {key}
                        </option>
                      ))}
                    </RHFSelect>
                  )}
                  {isEdit && (
                    <RHFTextField name="remark" label="Remark"  multiline rows={1} />
                  )}
                </LocalizationProvider>
              </FormBox>
              <Stack pt={3}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={12}>
                    <TableContainer>
                      <Table>
                        <TableBody>
                          {values?.leaveDays?.map((day, index) => (
                            <TableRow key={index}>
                              <TableCell>{day.date}</TableCell>
                              <TableCell>{day.dayName}</TableCell>
                              <TableCell>
                                {day.is_holiday ? (
                                  <Typography sx={{ color: '#FF4842' }}>
                                    {getHolidayName(day.date)}
                                  </Typography>
                                ) : (
                                  <RadioGroup
                                    row
                                    name={`row-radio-${index}`}
                                    value={day.selectedOption}
                                    onChange={(event) => {
                                      const newValue = event.target.value;
                                      handleRadioChange(index, newValue);
                                    }}
                                  >
                                    <FormControlLabel
                                      value="FullDay"
                                      control={<Radio />}
                                      label="Full Day"
                                    />
                                    <FormControlLabel
                                      value="FirstHalf"
                                      control={<Radio />}
                                      label="First Half"
                                    />
                                    <FormControlLabel
                                      value="SecondHalf"
                                      control={<Radio />}
                                      label="Second Half"
                                    />
                                  </RadioGroup>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <RHFTextField 
                      name="reason" 
                      label="Reason" 
                      required 
                      multiline 
                      rows={3} 
                      inputProps={{ maxLength: 500 }} 
                      helperText={`${values.reason.length}/500`}
                    />
                  </Grid>
                </Grid>
              </Stack>
            </form>
            <FormBottomButton
              cancelButton="/admin/leaves"
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
