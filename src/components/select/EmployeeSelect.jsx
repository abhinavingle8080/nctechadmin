import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { styled, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { getEmployeesApi } from '../../apis/admin/employee/EmployeeApis';

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiInputLabel-asterisk': {
    color: 'red',
  },
  '& .MuiSelect-select': {
    height: '1.1rem',
    borderColor: theme.palette.divider,
    '&:focus': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

EmployeeSelect.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.any,
  isError: PropTypes.bool,
};

function EmployeeSelect({ onChange, value, isError, ...other }) {
  const theme = useTheme();
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeData, setActiveData] = useState({
    page: 1,
    limit: 10,
    search: '',
  });

  const getEmployees = (data) => {
    setIsLoading(true);
    getEmployeesApi(data)
      .then((res) => {
        const optionsData = res?.data?.data?.rows?.map((item) => ({
          value: item?.id,
          label: `${item?.first_name} ${item?.last_name}`,
        }));
        if (activeData.page === 1) {
          setOptions(optionsData);
        } else {
          setOptions((prev) => [...prev, ...optionsData]);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const handleSearch = (search) => {
    setActiveData((prev) => ({ ...prev, search }));
  };

  const handleLoadMore = () => {
    setActiveData((prev) => ({ ...prev, page: activeData.page + 1 }));
  };

  useEffect(() => {
    getEmployees(activeData);
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [activeData]);

  return (
    <StyledFormControl variant="outlined" error={isError}>
      <InputLabel 
  id="employee-select-label" 
  htmlFor="employee-select" 
  required
  sx={{ '& .MuiInputLabel-asterisk': { color: 'red' } }}
>
  Employee List
</InputLabel>
      <Select
        labelId="employee-select-label"
        id="employee-select"
        label="Employee"
        onChange={onChange}
        value={value}
        MenuProps={{
          onScroll: handleLoadMore,
        }}
        {...other}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
        ))}
      </Select>
    </StyledFormControl>
  );
}

export default EmployeeSelect;
