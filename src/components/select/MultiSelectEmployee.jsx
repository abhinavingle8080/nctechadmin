import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { styled, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { getEmployeesApi } from '../../apis/admin/employee/EmployeeApis';

const MultiSelectEmployee = ({ onChange, defaultValue, ...other }) => {
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
          id: item?.id,
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

  // useEffect(() => {
  //   getEmployees(activeData);
  // }, [activeData]);

  return (
    <Autocomplete
      multiple
      id="multi-select-employee"
      options={options}
      getOptionLabel={(option) => option.label}
      defaultValue={defaultValue}
      onChange={(event, newValue) => {
        onChange(newValue);
      }}
      loading={isLoading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select Employees"
          placeholder="Select Employees"
          {...other}
        />
      )}
    />
  );
};

MultiSelectEmployee.propTypes = {
  onChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.array,
};

export default MultiSelectEmployee;
