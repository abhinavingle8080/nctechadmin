import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

export default function CourseTableRow({
  selected,
  name,
  avatarUrl,
  email,
  course,
  description,
  fees,
  date,
  paymentAmount,
  status,
  type,
  designation,
  emp_start_date,
  handleClick,
  onDelete,
  onView,
  onEdit,
  
   
}) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={name} src={avatarUrl} />
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>{course} {description}</TableCell>
        <TableCell>{fees}</TableCell>
        <TableCell>{paymentAmount} {date}</TableCell>
        <TableCell>
          <Label color={(status === 'Inactive' && 'error') || 'success'}>{status}</Label>
        </TableCell>
        <TableCell>
          <Label color={(type === 'offline' && 'error') || 'success'}>{type}</Label>
        </TableCell>
        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <Link to={onView} style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem onClick={handleCloseMenu}>
            <Iconify icon="carbon:view" sx={{ mr: 2 }} />
            View
          </MenuItem>
        </Link>
        <Link to={onEdit} style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem onClick={handleCloseMenu}>
            <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
            Edit
          </MenuItem>
        </Link>

        <MenuItem
          onClick={() => {
            onDelete();
            handleCloseMenu();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}

CourseTableRow.propTypes = {
  avatarUrl: PropTypes.any,
  email: PropTypes.any,
  handleClick: PropTypes.func,
  emp_start_date: PropTypes.any,
  name: PropTypes.any,
  course: PropTypes.any,
  paymentAmount: PropTypes.any,
  date: PropTypes.any,
  designation: PropTypes.any,
  selected: PropTypes.any,
  status: PropTypes.string,
  type: PropTypes.string,
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  description: PropTypes.string,
  fees: PropTypes.number.isRequired,

    // Assuming these are strings, adjust as per actual data type
};
