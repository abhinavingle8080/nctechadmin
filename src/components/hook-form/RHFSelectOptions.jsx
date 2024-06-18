import PropTypes from 'prop-types';
import {Controller ,useFormContext } from 'react-hook-form';
import { TextField, Autocomplete } from '@mui/material';

RHFSelectOptions.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    defaultValue: PropTypes.any,
};

export default function RHFSelectOptions({ name, label, options, defaultValue, ...other }) {
    const {
        control,
        formState: { errors },
    } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            render={({ field: { onChange, value } }) => (
                <Autocomplete
                    value={options.find((option) => option.value === value) || null}
                    onChange={(event, newValue) => {
                        onChange(newValue ? newValue.value : null);
                    }}
                    options={options}
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={label}
                            variant="outlined"
                            fullWidth
                            {...other}
                            error={!!errors[name]}
                            helperText={errors[name]?.message || ''}
                        />
                    )}
                />
            )}
        />
    );
}
