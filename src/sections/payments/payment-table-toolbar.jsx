// this is Payment-table-toolbar.jsx

import PropTypes from 'prop-types';

import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';  // Import TextField from MUI

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';  // Use DatePicker from MUI
import dayjs from 'dayjs';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function UserTableToolbar({ numSelected, filterName, onFilterName, fromDate, toDate, onFromDateChange, onToDateChange, errors }) {
  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: (theme) => theme.spacing(0, 1, 0, 3),
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <OutlinedInput
          value={filterName}
          onChange={onFilterName}
          placeholder="Search Payments..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify
                icon="eva:search-fill"
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          }
          sx={{ width: '30%' }}
        />
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Tooltip>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              maxDate={dayjs()}
              label="From Date"
              value={fromDate}
              onChange={(newDate) => onFromDateChange(newDate)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  helperText={errors?.fromDate ? errors?.fromDate?.message : null}
                  error={Boolean(errors?.fromDate)}
                  required
                />
              )}
            />
            <Typography>To</Typography>
            <DatePicker
              maxDate={dayjs()}
              label="To Date"
              value={toDate}
              onChange={(newDate) => onToDateChange(newDate)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  helperText={errors?.toDate ? errors?.toDate?.message : null}
                  error={Boolean(errors?.toDate)}
                  required
                />
              )}
            />
          </LocalizationProvider>
        </Box>
      )}
    </Toolbar>
  );
}

UserTableToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  fromDate: PropTypes.string,
  toDate: PropTypes.string,
  onFromDateChange: PropTypes.func,
  onToDateChange: PropTypes.func,
  errors: PropTypes.object,
};
